import m, { FactoryComponent } from 'mithril'

import {
  component,
  getValue,
  renderModel,
  ComponentModel,
  ValueSource,
  ComponentAttrs,
  setValue,
  ValueCodec,
} from '../../core'
import { call, clamp, cssClass, dragUtil, getTouchInTarget, getTouchPoint, twuiClass } from '../../core/utils'
import { NumberModel } from './number'
import { CheckboxModel } from './checkbox'

/**
 * @public
 */
export type SphericalValue = number[] | { [key: string]: number } | { [key: number]: number }

/**
 * Spherical component attributes
 * @public
 */
export type SphericalAttrs = ComponentAttrs<SphericalModel>

/**
 * Spherical component model
 * @public
 */
export interface SphericalModel<T = unknown>
  extends ComponentModel,
    ValueSource<T, SphericalValue> {
  /**
   * The type name of the control
   */
  type: 'spherical'
  /**
   * The object field names. Defaults to `['phi', 'theta']`
   */
  keys?: Array<string | number>
  /**
   * Whether to use degrees instead of radians
   */
  degree?: boolean
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: SphericalModel<T>, value: unknown) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: SphericalModel<T>, value: unknown) => void
}

const TYPE = 'spherical'
const KEYS = ['phi', 'theta']
const SphericalComponent: FactoryComponent<SphericalAttrs> = (vnode) => {
  let phi = 0 // azimuth     [0, 2PI]
  let theta = 0 // inclination [0,  PI]
  let backface = false

  let v2Phi = [0, 0]
  let v2Theta = [0, 0]

  let draggedKnob: 'phi' | 'theta'

  function toDeg(value: number) {
    return value * (180 / Math.PI)
  }
  function toRad(value: number) {
    return value * (Math.PI / 180)
  }
  function toScreen(value: number) {
    return clamp((value / 2 + 0.5) * 100, 0, 100)
  }

  function read(node: m.Vnode<SphericalAttrs>) {
    const data = node.attrs.data
    const value: any = getValue(data) || {
      phi: data.degree ? toDeg(phi) : phi,
      theta: data.degree ? toDeg(theta) : theta,
    }
    const [kPhi, kTheta] = data.keys || KEYS
    return { data, value, kPhi, kTheta }
  }

  function fetchValue(node: m.Vnode<SphericalAttrs>) {
    const { data, value, kPhi, kTheta } = read(node)
    phi = value[kPhi] || 0
    theta = value[kTheta] || 0
    if (data.degree) {
      phi = toRad(phi)
      theta = toRad(theta)
    }
    while (theta < 0) {
      theta += Math.PI
    }
    while (theta > Math.PI) {
      theta -= Math.PI
    }
    backface = theta > Math.PI / 2
    updatePositions()
  }

  function onChange(type: 'change' | 'input') {
    updatePositions()
    const { data, value, kPhi, kTheta } = read(vnode)
    value[kPhi] = data.degree ? toDeg(phi) : phi
    value[kTheta] = data.degree ? toDeg(theta) : theta
    const written = setValue(data, value)
    call(type === 'input' ? data.onInput : data.onChange, data, written)
  }

  function updatePositions() {
    v2Phi[0] = Math.cos(phi)
    v2Phi[1] = Math.sin(phi)
    v2Theta[0] = Math.sin(theta) * Math.cos(phi)
    v2Theta[1] = Math.sin(theta) * Math.sin(phi)
  }

  function onStartPhi(e: MouseEvent) {
    draggedKnob = 'phi'
    drag.activate(e)
  }
  function onStartTheta(e: MouseEvent) {
    draggedKnob = 'theta'
    drag.activate(e)
  }

  let touchOffset: [number, number]
  const drag = dragUtil({
    onStart: (e) => {
      const touch = getTouchInTarget(e)
      touchOffset = [
        -(touch.x - touch.width / 2),
        -(touch.y - touch.height / 2),
      ]
      drag.onMove(e)
    },
    onMove: (e) => {
      e.preventDefault()

      const position = getTouchInTarget(e, drag.target.parentElement, touchOffset)
      const px = position.normalizedX - 0.5
      const py = position.normalizedY - 0.5
      if (draggedKnob === 'phi') {
        // [-PI;PI]
        phi = Math.atan2(px, py)
        // convert to range [0;2PI]
        phi += phi < 0 ? 2 * Math.PI : 0
      } else if (draggedKnob === 'theta') {
        // closest point on segment
        // p0: [0, 0], p1: vPhi
        const ab = v2Phi
        const ac = [py, px]
        const t = (ab[0] * ac[0] + ab[1] * ac[1]) / Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1])

        theta = Math.PI * clamp(t, 0, 0.5)
        if (backface) {
          theta = Math.PI - theta
        }
      }
      onChange('input')
      m.redraw()
    },
    onEnd: (e) => {
      drag.deactivate()
      draggedKnob = null
      onChange('change')
      m.redraw()
    },
  })

  function onPhiInput(model: unknown, value: number) {
    phi = toRad(value)
    onChange('input')
  }
  function onPhiChange(model: unknown, value: number) {
    phi = toRad(value)
    onChange('change')
  }

  function onThetaInput(model: unknown, value: number) {
    theta = toRad(value)
    onChange('input')
  }
  function onThetaChange(model: unknown, value: number) {
    theta = toRad(value)
    onChange('change')
  }
  function onBackfaceChange(model: unknown, value: boolean) {
    backface = value
    theta = Math.PI - theta
    onChange('change')
    setTimeout(() => m.redraw())
  }

  return {
    onremove: () => {
      drag.deactivate()
    },
    oninit: (node) => {
      fetchValue(node)
    },
    onupdate: (node) => {
      fetchValue(node)
    },
    view: () => {
      return m(
        'div',
        {
          class: twuiClass(TYPE),
          style: {
            '--spherical-phi': `${toDeg(-phi) + 90}deg`,
          },
        },
        m(
          'div.left-container',
          m(
            'div.pane',
            {
              style: {
                position: 'relative',
                width: '100%',
                'padding-top': '100%',
              },
            },
            m(
              'div.phi-pane',
              {
                class: cssClass({
                  'is-dragging': draggedKnob === 'phi',
                }),
                style: {
                  position: 'absolute',
                  top: '0.5rem',
                  left: '0.5rem',
                  width: 'calc(100% - 1rem)',
                  height: 'calc(100% - 1rem)',
                },
              },
              m('div.phi-knob', {
                onmousedown: onStartPhi,
                ontouchstart: onStartPhi,
                style: {
                  position: 'absolute',
                  width: '15px',
                  height: '15px',
                  top: `calc(${toScreen(v2Phi[0])}% - 7px)`,
                  left: `calc(${toScreen(v2Phi[1])}% - 7px)`,
                },
              }),
            ),
            m(
              'div.theta-pane',
              {
                class: cssClass({
                  'is-dragging': draggedKnob === 'theta',
                }),
                style: {
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  width: 'calc(100% - 3rem)',
                  height: 'calc(100% - 3rem)',
                },
              },
              m('div.theta-knob', {
                onmousedown: onStartTheta,
                ontouchstart: onStartTheta,
                style: {
                  position: 'absolute',
                  width: '15px',
                  height: '15px',
                  top: `calc(${toScreen(v2Theta[0])}% - 7px)`,
                  left: `calc(${toScreen(v2Theta[1])}% - 7px)`,
                },
              }),
            ),
          ),
        ),
        m(
          'div.right-container',
          m('label', m.trust('&phi;')),
          renderModel<NumberModel>({
            type: 'number',
            min: 0,
            max: 360,
            step: 0.1,
            value: toDeg(phi),
            onInput: onPhiInput,
            onChange: onPhiChange,
          }),
          m('label', m.trust('&theta;')),
          renderModel<NumberModel>({
            type: 'number',
            min: 0,
            max: 180,
            step: 0.1,
            value: toDeg(theta),
            onInput: onThetaInput,
            onChange: onThetaChange,
          }),
          renderModel<CheckboxModel>({
            type: 'checkbox',
            value: backface,
            text: 'Backface',
            onChange: onBackfaceChange,
          }),
        ),
      )
    },
  }
}

component<SphericalAttrs>(TYPE, SphericalComponent)

/**
 * Direction name
 * @public
 */
export type Direction = 'right' | 'left' | 'up' | 'down' | 'front' | 'back'
export interface SphericalCodecOptions<T> {
  /**
   * Maps object keys to cartesian axes. Defaults to `{ x: 'right', y: 'up', z: 'back' }`
   */
  axes?: Record<string | number, Direction>
  /**
   * The vector length (sphere radius). Defaults to `1`
   */
  length?: number | (() => number)
  /**
   * Gets the objec where the result should be stored. May return a new instance.
   */
  result?: () => T
}

export function sphericalCodec(): ValueCodec<
  { x: number; y: number; z: number },
  { phi: number; theta: number }
>
export function sphericalCodec<T>(options: SphericalCodecOptions<T>): ValueCodec<T, { phi: number; theta: number }>
export function sphericalCodec({
  axes,
  length,
  result,
}: SphericalCodecOptions<any> = {}): ValueCodec<any, { phi: number; theta: number }> {
  axes = axes || { x: 'right', y: 'up', z: 'back' }
  const keys = Object.keys(axes)
  const radius = () => {
    return (typeof length === 'function' ? length() : length) || 1
  }
  return {
    decode: (value: any) => {
      let x: number = 0
      let y: number = 0
      let z: number = 0
      for (const key of keys) {
        switch (axes[key]) {
          case 'right':
            y = value[key]
            break
          case 'left':
            y = -value[key]
            break
          case 'back':
            x = value[key]
            break
          case 'front':
            x = -value[key]
            break
          case 'up':
            z = value[key]
            break
          case 'down':
            z = -value[key]
            break
          default:
            break
        }
      }
      const r = radius()
      x /= r
      y /= r
      z /= r
      return {
        phi: Math.atan2(y, x) || 0,
        theta: Math.atan(Math.sqrt(x * x + y * y) / z) || 0,
      }
    },
    encode: ({ phi, theta }: { phi: number; theta: number }) => {
      const r = radius()
      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)
      const value = result?.() || {}
      for (const key of keys) {
        switch (axes[key]) {
          case 'right':
            value[key] = y
            break
          case 'left':
            value[key] = -y
            break
          case 'back':
            value[key] = x
            break
          case 'front':
            value[key] = -x
            break
          case 'up':
            value[key] = z
            break
          case 'down':
            value[key] = -z
            break
          default:
            break
        }
      }
      return value
    },
  }
}
