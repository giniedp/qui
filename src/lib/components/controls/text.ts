import m from 'mithril'

import {
  getValue,
  component,
  setValue,
  ComponentModel,
  ValueSource,
  ComponentAttrs,
} from '../../core'
import { call, twuiClass, viewFn } from '../../core/utils'

/**
 * Text component attributes
 * @public
 */
export type TextAttrs = ComponentAttrs<TextModel>

/**
 * Text component model
 * @public
 */
export interface TextModel<T = unknown>
  extends ComponentModel,
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
  onInput?: (model: TextModel<T>, value: unknown) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: TextModel<T>, value: unknown) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

component<TextAttrs>('text', (node) => {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const written = setValue(data, el.value)
    call(e.type === 'input' ? data.onInput : data.onChange, data, written)
  }

  return {
    view: viewFn((data) => {
      return m("input[type='text']", {
        class: twuiClass(data.type),
        value: getValue(data),
        oninput: onChange,
        onchange: onChange,
        placeholder: data.placeholder,
        disabled: data.disabled,
      })
    }),
  }
})
