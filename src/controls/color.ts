import m from 'mithril'

import { ColorPickerDef } from './color-picker'
import {
  call,
  ControlDef,
  getComponent,
  getValue,
  isArray,
  isNumber,
  isObject,
  isString,
  padLeft,
  parseColor,
  registerComponent,
  renderControl,
  rgba2css,
  setValue,
} from './utils'

/**
 * Describes a color control
 */
export interface ColorDef<T = any> extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'color'
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
  value?: string | number | number[]
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
   * Will be called frequently during unput
   */
  onInput?: (value: ColorDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: ColorDef) => void
}

interface Attrs {
  data: ColorDef
}

interface State {
  opened: boolean
}

type ColorNode = m.Vnode<Attrs, State>

export function createColor(data: ColorDef) {
  return m(getComponent('color'), { data: data })
}

registerComponent('color', (node: ColorNode) => {

  function toggle() {
    node.state.opened = !node.state.opened
  }
  function onPickerInput(it: ColorPickerDef) {
    const data = node.attrs.data
    setValue(data, it.value)
    call(data.onInput, data)
  }

  function onPickerChange(it: ColorPickerDef) {
    const data = node.attrs.data
    setValue(data, it.value)
    call(data.onChange, data)
  }

  function getText() {
    const data = node.attrs.data
    const value = getValue(data)
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
    const rgba = parseColor(getValue(data), data.format)
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
              value: getValue(data),
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
