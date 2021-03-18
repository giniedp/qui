import m from 'mithril'

import { component, getValue, ComponentModel, ValueSource, ComponentAttrs } from '../../core'
import { call, clamp, use, twuiClass, viewFn, getTouchPoint, dragUtil } from '../../core/utils'

/**
 * Point component attributes
 * @public
 */
export type PointAttrs = ComponentAttrs<PointModel>

/**
 * Point component model
 * @public
 */
export interface PointModel<T = unknown> extends ComponentModel, ValueSource<T, any> {
  /**
   * The type name of the control
   */
  type: 'point'
  /**
   * The object field names. Defaults to `['x', 'y']`
   */
  keys?: string[]
  /**
   * X-Axis min and max valuse
   */
  xRange?: [number, number]
  /**
   * Y-Axis min and max valuse
   */
  yRange?: [number, number]
  /**
   * Value to reset to when released
   */
  reset?: [number, number]
  /**
   * Snap to grid value
   */
  snap?: number
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: PointModel<T>, value: number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: PointModel<T>, value: number) => void
}

const TYPE = 'point'
const DEFAULT_RANGE = [0, 1]
const DEFAULT_KEYS = ['x', 'y']
component<PointAttrs>(TYPE, (vnode) => {
  let kx: any
  let ky: any
  let xRange = DEFAULT_RANGE
  let yRange = DEFAULT_RANGE
  let vx = 0
  let vy = 0
  let x = 0
  let y = 0
  let rx: number
  let ry: number
  let snap: number

  function fetchValue(node: m.Vnode<PointAttrs>) {
    const data = node.attrs.data
    const keys = data.keys || DEFAULT_KEYS
    kx = keys[0]
    ky = keys[1]
    const value: any = getValue(data) ?? {
      [kx]: vx,
      [ky]: vy,
    }
    snap = data.snap
    vx = value[kx] || 0
    vy = value[ky] || 0
    xRange = data.xRange || xRange
    yRange = data.yRange || yRange
    x = (vx - xRange[0]) / (xRange[1] - xRange[0])
    y = (vy - yRange[0]) / (yRange[1] - yRange[0])
    const reset = data.reset
    if (reset) {
      rx = (reset[0] - xRange[0]) / (xRange[1] - xRange[0])
      ry = (reset[1] - yRange[0]) / (yRange[1] - yRange[0])
    }
  }

  function updateValue() {
    vx = xRange[0] + (xRange[1] - xRange[0]) * x
    vy = yRange[0] + (yRange[1] - yRange[0]) * y
    if (snap > 0) {
      vx = Math.floor(vx / snap) * snap
      vy = Math.floor(vy / snap) * snap
      x = (vx - xRange[0]) / (xRange[1] - xRange[0])
      y = (vy - yRange[0]) / (yRange[1] - yRange[0])
    }
  }

  function onChange(type: 'change' | 'input') {
    updateValue()
    const data = vnode.attrs.data
    const value: any = getValue(data) ?? {
      [kx]: vx,
      [ky]: vy,
    }
    value[kx] = vx
    value[ky] = vy
    call(type === 'input' ? data.onInput : data.onChange, data, value)
  }

  function onMouseDown(e: MouseEvent) {
    drag.activate(e)
  }

  const drag = dragUtil({
    onMove: (e) => {
      e.preventDefault()
      const target = drag.target
      const rect = target.getBoundingClientRect()
      const tx = window.pageXOffset || document.documentElement.scrollLeft
      const ty = window.pageYOffset || document.documentElement.scrollTop

      const cw = target.clientWidth
      const ch = target.clientHeight
      let [cx, cy] = getTouchPoint(e)
      x = clamp((cx - tx - rect.left) / cw, 0, 1)
      y = clamp((cy - ty - rect.top) / ch, 0, 1)

      onChange('input')
      m.redraw()
    },
    onEnd: () => {
      drag.deactivate()
      if (rx != null && ry != null) {
        x = rx
        y = ry
        onChange('input')
      }
      onChange('change')
      m.redraw()
    },
  })

  return {
    onremove: drag.deactivate,
    oninit: fetchValue,
    onupdate: fetchValue,
    view: () =>
      m(
        'div',
        {
          class: twuiClass(TYPE),
          tabindex: 0,
          onmousedown: onMouseDown,
          ontouchstart: onMouseDown,
        },
        m('.point-x-axis', {
          style: {
            'pointer-events': 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${y * 100}%`,
            height: `1px`,
          },
        }),
        m('.point-y-axis', {
          style: {
            'pointer-events': 'none',
            position: 'absolute',
            left: `${x * 100}%`,
            top: 0,
            bottom: 0,
            width: `1px`,
          },
        }),
        m('.point-cursor', {
          style: {
            'pointer-events': 'none',
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            position: 'absolute',
            width: '11px',
            height: '11px',
            'margin-top': '-5px',
            'margin-left': '-5px',
            border: '1px solid white',
            'border-radius': '5px',
            'box-shadow': '0px 0px 2px 1px rgba(0, 0, 0, 0.75)',
          },
        }),
      ),
  }
})
