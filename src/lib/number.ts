import m, { Child, ClassComponent, ClosureComponent } from 'mithril'

import { getModelValue, registerComponent, setModelValue } from './core'
import { call, clamp, cssClass, twuiClass, getMouseXY } from './utils'
import { ComponentModel, ComponentAttrs, ValueSource } from './types'

/**
 * Number component attributes
 * @public
 */
export type NumberAttrs = ComponentAttrs<NumberModel>

/**
 * Number component model
 * @public
 */
export interface NumberModel<T = unknown>
  extends ComponentModel,
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
   * Disables the control input
   */
  disabled?: boolean
}

export const NumberComponent: ClosureComponent<NumberAttrs> = () => {
  let type: 'number' | 'slider'
  let min: number
  let max: number
  let step: number
  let disabled: boolean
  let placeholder: string
  let isSlider: boolean
  let value: number
  let percent: number
  let focused: boolean
  let vnode: m.Vnode<NumberAttrs>
  // let data: NumberModel

  function fetchState(node: m.Vnode<NumberAttrs>) {
    vnode = node
    const data = node.attrs.data
    type = data.type
    isSlider = data.type === 'slider'
    min = isSlider && data.min == null ? 0 : data.min
    max = isSlider && data.max == null ? 1 : data.max
    step = data.step
    value = getModelValue<number>(data)
    disabled = data.disabled
    percent = isSlider ? ((value - min) / (max - min)) * 100 : 0
  }

  function setValue(e: 'input' | 'change', v: number) {
    v = clamp(isNaN(v) ? null : v, min, max)
    const data = vnode.attrs.data
    setModelValue(data, v)
    call(e === 'input' ? data.onInput : data.onChange, data, v)
    if (v !== value) {
      value = v
      m.redraw()
    }
  }

  function onInput(e: Event) {
    const el = e.target as HTMLInputElement
    setValue('input', parseFloat(el.value))
  }

  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    setValue('change', parseFloat(el.value))
  }

  function limit(v: number) {
    v = clamp(v, min, max)
    if (step != null) {
      v = Math.round(v / step) * step
    }
    return parseFloat(v.toFixed(5))
  }

  let target: HTMLElement
  function enableDrag(el: HTMLElement) {
    disableDrag()
    target = el
    const options = { passive: false }
    document.addEventListener('mousemove', onDrag, options)
    document.addEventListener('mouseup', onDragEnd, options)
    document.addEventListener('touchmove', onDrag, options)
    document.addEventListener('touchend', onDragEnd, options)
    document.addEventListener('touchcancel', onDragEnd, options)
  }
  function disableDrag() {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('touchend', onDragEnd)
    document.removeEventListener('touchcancel', onDragEnd)
  }

  function onDragStart(e: MouseEvent) {
    if (!disabled) {
      enableDrag(e.target as HTMLElement)
      onDrag(e, true)
    }
  }

  function onDrag(e: MouseEvent, initial?: boolean) {
    if (!target) {
      return
    }
    if (!initial) {
      e.preventDefault()
    }
    const l =
      (window.pageXOffset || document.documentElement.scrollLeft) +
      target.getBoundingClientRect().left
    const w = target.clientWidth
    const s = (getMouseXY(e)[0] - l) / w
    setValue('input', limit(min + s * (max - min)))
  }

  function onDragEnd() {
    if (target && !disabled) {
      target = null
      setValue('change', value)
    }
    disableDrag()
  }

  function onKeydown(e: KeyboardEvent) {
    const code = e.key || e.keyCode
    const dir = code === 'ArrowLeft' ? -1 : code === 'ArrowRight' ? 1 : 0
    const add = (step || 1) * dir
    if (add) {
      setValue('change', limit((value || 0) + add))
    }
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const dir = (e.ctrlKey ? 0.5 : 1) * clamp(e.deltaY, -1, 1)
    const add = (step || 0.2) * dir
    if (add) {
      setValue('change', limit((value || 0) - add))
    }
  }

  function onFocus() {
    focused = true
  }

  function onBlur() {
    focused = false
  }

  function slider(): Child {
    return m(
      '.twui-progress',
      {
        style: 'user-select: none;',
        class: cssClass({
          disabled: !!disabled,
        }),
        ...(disabled
          ? {}
          : {
              tabindex: 0,
              onmousedown: onDragStart,
              onmousemove: onDrag,
              onmouseup: onDragEnd,

              ontouchstart: onDragStart,
              ontouchmove: onDrag,
              ontouchend: onDragEnd,
              ontouchcancel: onDragEnd,
              onkeydown: onKeydown,
              onwheel: onWheel,
            }),
      },
      m('.twui-progress-bar', {
        style: {
          width: `${percent}%`,
          'pointer-events': 'none',
          'user-select': 'none',
        },
      }),
    )
  }

  return {
    onremove: () => {
      disableDrag()
    },
    oninit: (node) => {
      fetchState(node)
    },
    onupdate: (node) => {
      fetchState(node)
    },
    view: () => {
      return m(
        'div',
        {
          class: twuiClass(type),
        },
        isSlider ? slider() : null,
        m("input[type='number']", {
          min: min,
          max: max,
          step: step,
          value: value,
          oninput: onInput,
          onchange: onChange,
          onwheel: onWheel,
          onfocus: onFocus,
          onblur: onBlur,
          placeholder: placeholder,
          disabled: disabled,
        }),
      )
    },
  }
}

registerComponent('number', NumberComponent)
registerComponent('slider', NumberComponent)
