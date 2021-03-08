import m, { FactoryComponent } from 'mithril'

import { registerComponent, getModelValue, renderModel } from './core'
import {
  call,
  clamp,
  cssClass,
  dragUtil,
  getTouchPosition,
  twuiClass,
  viewFn,
} from './utils'
import { ComponentModel, ValueSource, ComponentAttrs } from './types'
import { NumberModel } from './number'
import { CheckboxModel } from './checkbox'

/**
 * @public
 */
export type SphericalValue =
  | number[]
  | { [key: string]: number }
  | { [key: number]: number }

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
  keys?: string[]
  /**
   * Whether to use degrees instead of radians
   */
  degree?: boolean
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (
    model: SphericalModel<T>,
    value: SphericalValue,
    key?: string | number,
  ) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (
    model: SphericalModel<T>,
    value: SphericalValue,
    key?: string | number,
  ) => void
}

const TYPE = 'spherical'
const defaultKeys = ['phi', 'theta']
export const SphericalComponent: FactoryComponent<SphericalAttrs> = (vnode) => {
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

  function fetchValue(node: m.Vnode<SphericalAttrs>) {
    const data = node.attrs.data
    const value: any = getModelValue(data) || {
      phi: data.degree ? toDeg(phi) : phi,
      theta: data.degree ? toDeg(theta) : theta,
    }
    const [kPhi, kTheta] = data.keys || defaultKeys
    phi = value[kPhi] || 0
    theta = value[kTheta] || 0
    if (data.degree) {
      phi = toRad(phi)
      theta = toRad(theta)
    }
    backface = theta > Math.PI / 2
    updatePositions()
  }

  function onChange(type: 'change' | 'input') {
    updatePositions()
    const data = vnode.attrs.data
    const value: any = getModelValue(data) || {
      phi: data.degree ? toDeg(phi) : phi,
      theta: data.degree ? toDeg(theta) : theta,
    }
    const [kPhi, kTheta] = data.keys || defaultKeys
    value[kPhi] = data.degree ? toDeg(phi) : phi
    value[kTheta] = data.degree ? toDeg(theta) : phi
    call(type === 'input' ? data.onInput : data.onChange, data, value)
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

  const drag = dragUtil({
    onStart: (e) => {
      drag.onMove(e)
    },
    onMove: (e) => {
      e.preventDefault()

      const position = getTouchPosition(drag.target.parentElement, e)
      const px = position.normalizedX - 0.5
      const py = position.normalizedY - 0.5
      if (draggedKnob === 'phi') {
        // [-PI;PI]
        phi = Math.atan2(px, py)
        // convert to range [0;2PI]
        phi += phi < 0 ? 2 * Math.PI : 0
      } else if (draggedKnob === 'theta') {
        // closest point on segment
        const ab = v2Phi
        const ac = [py, px]
        const t =
          (ab[0] * ac[0] + ab[1] * ac[1]) /
          Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1])

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
                  width: '13px',
                  height: '13px',
                  top: `calc(${toScreen(v2Phi[0])}% - 6px)`,
                  left: `calc(${toScreen(v2Phi[1])}% - 6px)`,
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
                  width: '13px',
                  height: '13px',
                  top: `calc(${toScreen(v2Theta[0])}% - 6px)`,
                  left: `calc(${toScreen(v2Theta[1])}% - 6px)`,
                },
              }),
            ),
          ),
        ),
        m(
          'div.right-container',
          m('label', m.trust('&phi;')),
          renderModel<NumberModel>({
            label: 'test',
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

registerComponent<SphericalAttrs>(TYPE, SphericalComponent)
