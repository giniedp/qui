import m, { FactoryComponent } from 'mithril'

import { registerComponent, getModelValue, renderModel, setModelValue } from './core'
import {
  call,
  clamp,
  cssClass,
  dragUtil,
  getTouchPosition,
  twuiClass,
} from './utils'
import { ComponentModel, ValueSource, ComponentAttrs } from './types'
import { NumberModel } from './number'
import { CheckboxModel } from './checkbox'

/**
 * Spherical component attributes
 * @public
 */
export type AngleAttrs = ComponentAttrs<AngleModel>

/**
 * Spherical component model
 * @public
 */
export interface AngleModel<T = unknown>
  extends ComponentModel,
    ValueSource<T, number> {
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
  onInput?: (
    model: AngleModel<T>,
    value: number,
    key?: string | number,
  ) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (
    model: AngleModel<T>,
    value: number,
    key?: string | number,
  ) => void
}

const TYPE = 'angle'
export const AngleComponent: FactoryComponent<AngleAttrs> = (vnode) => {
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
    angle = getModelValue(data) ?? angle
    if (data.degree) {
      angle = toRad(angle)
    }
    updatePositions()
  }

  function onChange(type: 'change' | 'input') {
    updatePositions()
    const data = vnode.attrs.data
    const value = data.degree ? toRad(angle) : angle
    setModelValue(data, value)
    call(type === 'input' ? data.onInput : data.onChange, data, value)
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
            '--angle-percent': `${toDeg(angle) / 360 * 100}%`,
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
                  width: '13px',
                  height: '13px',
                  top: `calc(${toScreen(pos[0])}% - 6px)`,
                  left: `calc(${toScreen(pos[1])}% - 6px)`,
                },
              }),
            ),
          ),
        ),
        m(
          'div.right-container',
          m('label', m.trust('&alpha;')),
          renderModel<NumberModel>({
            label: 'test',
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

registerComponent<AngleAttrs>(TYPE, AngleComponent)
