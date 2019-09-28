import m from 'mithril'

import {
  ControlViewModel,
  getModelValue,
  registerComponent,
  renderControl,
  setModelValue,
  ValueSource,
} from './core'
import { call } from './utils'

/**
 * Describes a text control
 *
 * @public
 */
export interface TextModel<T = any>
  extends ControlViewModel,
  ValueSource<T, string> {
  /**
   * The type name of the control
   */
  type: 'text'
  /**
   * The placeholder text
   */
  placeholder?: string
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: TextModel<T>, value: number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: TextModel<T>, value: number) => void
  /**
   * Disabled the control input
   */
  disabled?: boolean
}

interface Attrs {
  data: TextModel
}

registerComponent('text', (node: m.Vnode<Attrs>) => {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    setModelValue(data, el.value)
    if (e.type === 'input') {
      call(data.onInput, data, el.value)
    }
    if (e.type === 'change') {
      call(data.onChange, data, el.value)
    }
  }

  return {
    view: () => {
      return renderControl(node, (data) => {
        return m("input[type='text']", {
          value: getModelValue(data),
          oninput: onChange,
          onchange: onChange,
          placeholder: data.placeholder,
          disabled: data.disabled,
        })
      })
    },
  }
})
