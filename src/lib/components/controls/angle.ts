import m, { FactoryComponent } from 'mithril'

import {
  component,
  getValue,
  renderModel,
  setValue,
  ComponentModel,
  ValueSource,
  ComponentAttrs,
  ValueCodec,
} from '../../core'
import { call, clamp, cssClass, dragUtil, getTouchPosition, twuiClass } from '../../core/utils'
import type { NumberModel } from './number'
import { Direction } from './spherical'

/**
 * Spherical component attributes
 * @public
 */
export type AngleAttrs = ComponentAttrs<AngleModel>

/**
 * Spherical component model
 * @public
 */
export interface AngleModel<T = unknown> extends ComponentModel, ValueSource<T, number> {
  /**
   * The type name of the control
   */
  type: 'angle'
  /**
   * Whether to use degrees instead of radians
   */
  degree?: boolean
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: AngleModel<T>, value: unknown) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: AngleModel<T>, value: unknown) => void
}

const TYPE = 'angle'
const AngleComponent: FactoryComponent<AngleAttrs> = (vnode) => {
  let angle = 0
  let dragged = false
  let pos = [0, 0]

  function toDeg(value: number) {
    return value * (180 / Math.PI)
  }
  function toRad(value: number) {
    return value * (Math.PI / 180)
  }
  function toScreen(value: number) {
    return clamp((value / 2 + 0.5) * 100, 0, 100)
  }

  function fetchValue(node: m.Vnode<AngleAttrs>) {
    const data = node.attrs.data
    angle = getValue(data) ?? angle
    if (data.degree) {
      angle = toRad(angle)
    }
    updatePositions()
  }

  function onChange(type: 'change' | 'input') {
    updatePositions()
    const data = vnode.attrs.data
    const value = data.degree ? toRad(angle) : angle
    const written = setValue(data, value)
    call(type === 'input' ? data.onInput : data.onChange, data, written)
  }

  function updatePositions() {
    pos[0] = Math.cos(angle)
    pos[1] = Math.sin(angle)
  }

  function onStartPhi(e: MouseEvent) {
    dragged = true
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
      if (dragged) {
        // [-PI;PI]
        angle = Math.atan2(px, py)
        // convert to range [0;2PI]
        angle += angle < 0 ? 2 * Math.PI : 0
      }
      onChange('input')
      m.redraw()
    },
    onEnd: (e) => {
      drag.deactivate()
      dragged = false
      onChange('change')
      m.redraw()
    },
  })

  function onPhiInput(model: unknown, value: number) {
    angle = toRad(value)
    onChange('input')
  }
  function onPhiChange(model: unknown, value: number) {
    angle = toRad(value)
    onChange('change')
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
            '--angle-value': `${toDeg(-angle) + 90}deg`,
            '--angle-percent': `${(toDeg(angle) / 360) * 100}%`,
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
              'div.angle-pane',
              {
                class: cssClass({
                  'is-dragging': dragged,
                }),
                style: {
                  position: 'absolute',
                  top: '0.5rem',
                  left: '0.5rem',
                  width: 'calc(100% - 1rem)',
                  height: 'calc(100% - 1rem)',
                },
              },
              m('div.angle-knob', {
                onmousedown: onStartPhi,
                ontouchstart: onStartPhi,
                style: {
                  position: 'absolute',
                  width: '15px',
                  height: '15px',
                  top: `calc(${toScreen(pos[0])}% - 7px)`,
                  left: `calc(${toScreen(pos[1])}% - 7px)`,
                },
              }),
            ),
          ),
        ),
        m(
          'div.right-container',
          m('label', m.trust('&alpha;')),
          renderModel<NumberModel>({
            type: 'number',
            min: 0,
            max: 360,
            step: 0.1,
            value: toDeg(angle),
            onInput: onPhiInput,
            onChange: onPhiChange,
          }),
        ),
      )
    },
  }
}

component<AngleAttrs>(TYPE, AngleComponent)

export interface AngleCodecOptions<T> {
  /**
   * Maps object keys to cartesian axes. Defaults to `{ x: 'right', y: 'up' }`
   */
  axes?: Record<string | number, Direction>
  /**
   * The vector length (circle radius). Defaults to `1`
   */
  length?: number | (() => number)
  /**
   * Gets the objec where the result should be stored. May return a new instance.
   */
  result?: () => T
}

export function angleCodec(): ValueCodec<{ x: number; y: number }, number>
export function angleCodec<T>(options: AngleCodecOptions<T>): ValueCodec<T, number>
export function angleCodec({ axes, length, result }: AngleCodecOptions<any> = {}): ValueCodec<
  any,
  number
> {
  axes = axes || { x: 'right', y: 'up'}
  const keys = Object.keys(axes)
  const radius = () => {
    return (typeof length === 'function' ? length() : length) || 1
  }
  return {
    decode: (value: any) => {
      let x: number = 0
      let y: number = 0
      for (const key of keys) {
        switch (axes[key]) {
          case 'right':
            y = value[key]
            break
          case 'left':
            y = -value[key]
            break
          case 'up':
          case 'front':
            x = -value[key]
            break
          case 'down':
          case 'back':
            x = value[key]
          default:
            break
        }
      }
      const r = radius()
      x /= r
      y /= r
      return Math.atan2(y, x) || 0
    },
    encode: (angle) => {
      const r = radius()
      const x = r * Math.cos(angle)
      const y = r * Math.sin(angle)
      const value = result() || {}
      for (const key of keys) {
        switch (axes[key]) {
          case 'right':
            value[key] = y
            break
          case 'left':
            value[key] = -y
            break
          case 'up':
          case 'front':
            value[key] = -x
            break
          case 'down':
          case 'back':
            value[key] = x
            break
          default:
            break
        }
      }
      return value
    },
  }
}
