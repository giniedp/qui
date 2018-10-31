import m from 'mithril'

import { ColorPickerDef } from './color-picker'
import { call, ControlDef, getComponent, label, registerComponent, tap } from './utils'

/**
 * Describes a color control
 */
export interface ColorDef extends ControlDef {
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
  value?: string
  /**
   * The format of the string value. Defaults to 'rgb'
   *
   * @remarks
   * This must be a combination of the letters r, g, b and a
   * and it must match the input value.
   */
  format?: string
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

export function createColor(data: ColorDef) {
  return m(getComponent('color'), { data: data })
}

registerComponent('color', (node: m.Vnode<Attrs>) => {

  let opened = false

  function toggle() {
    opened = !opened
  }
  function onPickerInput(it: ColorPickerDef) {
    tap(node.attrs.data, (data) => {
      data.value = it.value
      call(data.onInput, data)
    })
  }

  function onPickerChange(it: ColorPickerDef) {
    tap(node.attrs.data, (data) => {
      data.value = it.value
      call(data.onChange, data)
    })
  }

  return {
    view: () => {
      return tap(node.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-color', key: data.key },
          label(data.label),
          m('section',
            m('button', {
              type: 'button', style: { 'background-color': data.value },
              onclick: toggle,
            }, data.value),
            opened ? m(getComponent('color-picker'), { data: {
              label: null,
              value: data.value,
              format: data.format,
              onInput: onPickerInput,
              onChange: onPickerChange,
            } }) : null,
          ),
        )
      })
    },
  }
})
