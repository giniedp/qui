import m from 'mithril'

import { ColorPickerModel } from './color-picker'
import { ControlViewModel, getComponent, getModelValue, registerComponent, renderControl, setModelValue, ValueSource } from './core'
import {
  call,
  isArray,
  isNumber,
  isObject,
  isString,
  padLeft,
  parseColor,
  rgba2css,
} from './utils'

/**
 * Describes a color control
 * @public
 */
export interface ColorModel<T = any, V = number | string | number[]> extends ControlViewModel, ValueSource<T, V>  {
  /**
   * The type name of the control
   */
  type: 'color'
  /**
   * The color value as a string.
   *
   * @remarks
   * The format is determined by the `format` property.
   *
   * It is allowed to omit the '#' character but the '#' will be added on change
   *
   * It is allowed to use single character form per component (#f00 instead of #ff0000)
   * but it will always be written back as #ff0000 on change
   */
  value?: V
  /**
   * The format of the string value. Defaults to 'rgb'
   *
   * @remarks
   * This must be a combination of the letters r, g, b and a
   * and it must match the input value.
   */
  format?: string
  /**
   * Whether each component is normalized to range [0:1]
   */
  normalized?: boolean
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: ColorModel<T, V>, value: V) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: ColorModel<T, V>, value: V) => void
}

interface Attrs {
  data: ColorModel
}

interface State {
  opened: boolean
}

type ColorNode = m.Vnode<Attrs, State>

registerComponent('color', (node: ColorNode) => {

  function toggle() {
    node.state.opened = !node.state.opened
  }
  function onPickerInput(it: ColorPickerModel, value: any) {
    const data = node.attrs.data
    setModelValue(data, value)
    call(data.onInput, data, value)
  }

  function onPickerChange(it: ColorPickerModel, value: any) {
    const data = node.attrs.data
    setModelValue(data, value)
    call(data.onChange, data, value)
  }

  function getText() {
    const data = node.attrs.data
    const value = getModelValue(data)
    if (isString(value)) {
      return value
    }
    if (isNumber(value)) {
      return '0x' + padLeft(value.toString(16), 8, '0')
    }
    if (isArray(value)) {
      return value.map((it: number) => it < 1 && it > 0 ? it.toFixed(2) : it).join(' , ')
    }
    if (isObject(value)) {
      return Object.keys(value).map((k) => {
        const it = (value as any)[k]
        return `${k}: ${it < 1 && it > 0 ? it.toFixed(2) : it}`
      }).join(' ')
    }
    if (data.value == null) {
      return 'null'
    }
    return '?'
  }

  function getColor() {
    const data = node.attrs.data
    const rgba = parseColor(getModelValue(data), data.format)
    return rgba2css(rgba, 1)
  }

  return {
    state: {
      opened: false,
    },
    view: () => {
      return renderControl(node, (data, state) => {
        return [
          m("button[type='button']", {
            style: { 'background-color': getColor() },
            onclick: toggle,
          }, getText()),
          state.opened ? m(getComponent('color-picker'), {
            data: {
              type: 'color-picker',
              label: null,
              value: getModelValue(data),
              format: data.format,
              onInput: onPickerInput,
              onChange: onPickerChange,
            },
          }) : null,
        ]
      })
    },
  }
})
