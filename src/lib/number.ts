import m from 'mithril'

import {
  ControlViewModel,
  getModelValue,
  registerComponent,
  renderControl,
  setModelValue,
  ValueSource,
} from './core'
import { call, clamp } from './utils'

/**
 * Describes a number control
 * @public
 */
export interface NumberModel<T = any>
  extends ControlViewModel,
    ValueSource<T, number> {
  /**
   * The type name of the control
   */
  type: 'number' | 'slider'
  /**
   * The placeholder text
   */
  placeholder?: string
  /**
   * The min value
   */
  min?: number
  /**
   * The max value
   */
  max?: number
  /**
   * The step value
   */
  step?: number
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: NumberModel<T>, value: number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: NumberModel<T>, value: number) => void
  /**
   * Disabled the control input
   */
  disabled?: boolean
}

interface Attrs {
  data: NumberModel
}

function numberComponent(node: m.Vnode<Attrs>) {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const value = parseFloat(el.value)
    setModelValue(data, isNaN(value) ? null : value)
    if (e.type === 'input') {
      call(data.onInput, data, value)
    }
    if (e.type === 'change') {
      call(data.onChange, data, value)
    }
  }

  function isSlider(data: NumberModel) {
    return data.type === 'slider'
  }
  function min(data: NumberModel) {
    return isSlider(data) && data.min == null ? 0 : data.min
  }
  function max(data: NumberModel) {
    return isSlider(data) && data.max == null ? 1 : data.max
  }
  function getPercent(data: NumberModel) {
    return Math.floor(
      ((getModelValue(data) - min(data)) / (max(data) - min(data))) * 100,
    )
  }

  function limitValue(data: NumberModel, value: number) {
    value = clamp(value, min(data), max(data))
    if (data.step != null) {
      const digits = clamp((data.step % 1).toString(10).length - 2, 0, 100)
      value = parseFloat(
        (Math.round(value / data.step) * data.step).toFixed(digits),
      )
    }
    return value
  }

  let target: HTMLElement
  function dragStart(e: MouseEvent | TouchEvent) {
    target = e.target as HTMLElement
    drag(e)
  }

  function drag(e: MouseEvent | TouchEvent) {
    if (!target) {
      return
    }

    const rect = target.getBoundingClientRect()
    const tx = window.pageXOffset || document.documentElement.scrollLeft

    const cw = target.clientWidth
    const px = 'touches' in e ? e.touches.item(0).pageX : e.pageX
    const cx = (px - tx - rect.left) / cw
    const data = node.attrs.data
    const value = limitValue(data, (max(data) - min(data)) * cx + min(data))
    setModelValue(data, value)
    call(data.onInput, data)
    m.redraw()
  }

  function dragEnd() {
    if (target) {
      target = null
      const data = node.attrs.data
      call(data.onChange, data)
      m.redraw()
    }
  }

  function keydown(e: KeyboardEvent) {
    const code = e.key || e.keyCode
    const step = code === 'ArrowLeft' ? -1 : code === 'ArrowRight' ? 1 : 0
    const data = node.attrs.data
    if (step && data) {
      const value = limitValue(data, data.value + step * (data.step || 1))
      setModelValue(data, value)
      call(data.onChange, data, value)
    }
  }

  return {
    oncreate: () => {
      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', dragEnd)
    },
    onremove: () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', dragEnd)
    },
    view: () => {
      return renderControl(node, (data) => {
        return [
          isSlider(data)
            ? m(
                '.tweakui-progress',
                {
                  style: 'user-select: none;',
                  tabindex: 0,
                  onmousedown: dragStart,
                  onmousemove: drag,
                  onmouseup: dragEnd,

                  ontouchstart: dragStart,
                  ontouchmove: drag,
                  ontouchend: dragEnd,
                  ontouchcancel: dragEnd,
                  onkeydown: keydown,
                },
                m('.tweakui-progress-bar', {
                  style: `width: ${getPercent(
                    data,
                  )}%; pointer-events: none; user-select: none;`,
                }),
              )
            : null,
          m("input[type='number']", {
            min: data.min,
            max: data.max,
            step: data.step,
            value: getModelValue(data),
            oninput: onChange,
            onchange: onChange,
            placeholder: data.placeholder,
            disabled: data.disabled,
          }),
        ]
      })
    },
  }
}

registerComponent('number', numberComponent)
registerComponent('slider', numberComponent)
