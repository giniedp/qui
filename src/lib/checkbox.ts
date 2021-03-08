import m, { FactoryComponent } from 'mithril'

import {
  getModelValue,
  registerComponent,
  setModelValue,
} from './core'
import { call, twuiClass, cssClass, viewFn } from './utils'
import { ValueSource, ComponentAttrs, ComponentModel } from './types'

/**
 * Checkbox component attrs
 * @public
 */
export type CheckboxAttrs = ComponentAttrs<CheckboxModel>

/**
 * Describes a checkbox control
 * @public
 */
export interface CheckboxModel<T = unknown> extends ComponentModel, ValueSource<T, boolean> {
  /**
   * The type name of the control
   */
  type: 'checkbox'
  /**
   * This is called when the control value changes
   */
  onChange?: (value: CheckboxModel, checked: boolean) => void
  /**
   * Text behind the checkbox or inside the buttn
   */
  text?: string
  /**
   * Disables the control input
   */
  disabled?: boolean
}

const TYPE = 'checkbox'
export const CheckboxComponent: FactoryComponent<CheckboxAttrs> = (node) => {
  function onChange(e: Event) {
    const data = node.attrs.data
    const checked = (e.target as HTMLInputElement).checked
    setModelValue(data, checked)
    call(data.onChange, data, checked)
  }
  return {
    view: viewFn((data) => {
      const checked = getModelValue(data) === true
      return m(
        'label',
        {
          class: cssClass({
            [twuiClass(TYPE)]: true,
            checked: checked,
            disabled: data.disabled,
          }),
        },
        m('input', {
          type: 'checkbox',
          checked: checked,
          onchange: onChange,
          disabled: data.disabled,
        }),
        data.text,
      )
    }),
  }
}

registerComponent(TYPE, CheckboxComponent)
