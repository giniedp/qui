import m, { Child } from 'mithril'

import {
  getModelValue,
  registerComponent,
  setModelValue,
} from './core'
import { call, clamp, use, cssClass, twuiClass, viewFn, getMouseXY } from './utils'
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
export interface NumberModel<T = any>
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

function numberComponent(node: m.Vnode<NumberAttrs>) {

  let min: number
  let max: number
  let isSlider: boolean
  let value: number
  let percent: number
  let data: NumberModel

  function updateState() {
    data = node.attrs.data
    value = getModelValue(data)
    isSlider = data.type === 'slider'
    min = isSlider && data.min == null ? 0 : data.min
    max = isSlider && data.max == null ? 1 : data.max
    percent = isSlider ? ((value - min) / (max - min)) * 100 : 0
  }

  function setValue(e: 'input' | 'change', v: number) {
    setModelValue(data, isNaN(v) ? null : v)
    call(e === 'input' ? data.onInput : data.onChange, data, v)
    if (v !== value) {
      m.redraw()
    }
  }

  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    setValue('change', parseFloat(el.value))
  }

  function limit(v: number) {
    v = clamp(v, min, max)
    if (data.step != null) {
      v = Math.round(v / data.step) * data.step
    }
    return parseFloat(v.toFixed(5))
  }

  let target: HTMLElement
  function dragStart(e: MouseEvent | TouchEvent) {
    if (!data.disabled) {
      target = e.target as HTMLElement
      drag(e)
    }
  }

  function drag(e: MouseEvent | TouchEvent) {
    if (!target) {
      return
    }
    e.preventDefault()
    const l = (window.pageXOffset || document.documentElement.scrollLeft) + target.getBoundingClientRect().left
    const w = target.clientWidth
    const s = (getMouseXY(e)[0] - l) / w
    setValue('input', limit(min + s * (max - min)))
  }

  function dragEnd() {
    if (target && !data.disabled) {
      target = null
      setValue('change', value)
    }
  }

  function onKeydown(e: KeyboardEvent) {
    const code = e.key || e.keyCode
    const step = (data.step || 1) * (code === 'ArrowLeft' ? -1 : code === 'ArrowRight' ? 1 : 0)
    if (step) {
      setValue('change', limit((value || 0) + step))
    }
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const step = (data.step || 0.2) * (e.ctrlKey ? 0.5 : 1) * clamp(e.deltaY, -1, 1)
    if (step) {
      setValue('change', limit((value || 0) - step))
    }
  }

  function slider(): Child {
    return m(
      '.twui-progress',
      {
        style: 'user-select: none;',
        class: cssClass({
          disabled: !!data.disabled,
        }),
        ...(data.disabled ? {} : {
          tabindex: 0,
          onmousedown: dragStart,
          onmousemove: drag,
          onmouseup: dragEnd,

          ontouchstart: dragStart,
          ontouchmove: drag,
          ontouchend: dragEnd,
          ontouchcancel: dragEnd,
          onkeydown: onKeydown,
          onwheel: onWheel,
        }),
      },
      m('.twui-progress-bar', {
        style: `width: ${percent}%; pointer-events: none; user-select: none;`,
      }),
    )
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
    view: viewFn(() => {
      updateState()
      return m(
        'div',
        {
          class: twuiClass(data.type),
        },
        isSlider ? slider() : null,
        m("input[type='number']", {
          min: data.min,
          max: data.max,
          step: data.step,
          value: getModelValue(data),
          oninput: onChange,
          onchange: onChange,
          onwheel: onWheel,
          placeholder: data.placeholder,
          disabled: data.disabled,
        }),
      )
    }),
  }
}

registerComponent('number', numberComponent)
registerComponent('slider', numberComponent)
