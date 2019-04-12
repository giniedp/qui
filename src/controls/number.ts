import m from 'mithril'

import { call, clamp, ControlDef, getValue, registerComponent, renderControl, setValue } from './utils'

/**
 * Describes a number control
 */
export interface NumberDef<T = any> extends ControlDef {
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
   * The target object where to get/set the value
   *
   * @remarks
   * Requires the `property` option to be set.
   */
  target?: T
  /**
   * The property name of `target` object
   *
   * @remarks
   * Requires the `target` option to be set.
   */
  property?: keyof T
  /**
   * If `target` and `property` are not set, then this value will be used
   */
  value?: number
  /**
   * Will be called frequently during unput
   */
  onInput?: (value: NumberDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: NumberDef) => void
}

interface Attrs {
  data: NumberDef
}

function numberComponent(node: m.Vnode<Attrs>) {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const value = parseFloat(el.value)
    setValue(data, isNaN(value) ? null : value)
    if (e.type === 'input') {
      call(data.onInput, data)
    }
    if (e.type === 'change') {
      call(data.onChange, data)
    }
  }

  function isSlider(data: NumberDef) {
    return data.type === 'slider'
  }
  function min(data: NumberDef) {
    return isSlider(data) && data.min == null ? 0 : data.min
  }
  function max(data: NumberDef) {
    return isSlider(data) && data.max == null ? 1 : data.max
  }
  function getPercent(data: NumberDef) {
    return Math.floor((getValue(data) - min(data)) / (max(data) - min(data)) * 100)
  }

  function limitValue(data: NumberDef, value: number) {
    value = clamp(value, min(data), max(data))
    if (data.step != null) {
      const digits = (data.step % 1).toString(10).length - 2
      value = parseFloat((Math.round(value / data.step) * data.step).toFixed(digits))
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
    setValue(data, limitValue(data, (max(data) - min(data)) * cx + min(data)))
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
    const step = (code === 'ArrowLeft' ? -1 : code === 'ArrowRight' ? 1 : 0)
    const data = node.attrs.data
    if (step && data) {
      setValue(data, limitValue(data, data.value + step * (data.step || 1)))
      call(data.onChange, data)
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
          isSlider(data) ? m('.qui-progress', {
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
          }, m('.qui-progress-bar', {
              style: `width: ${getPercent(data)}%; pointer-events: none; user-select: none;`,
            }),
          ) : null,
          m("input[type='number']", {
            min: data.min,
            max: data.max,
            step: data.step,
            value: getValue(data),
            oninput: onChange,
            onchange: onChange,
            placeholder: data.placeholder,
          }),
        ]
      })
    },
  }
}

registerComponent('number', numberComponent)
registerComponent('slider', numberComponent)
