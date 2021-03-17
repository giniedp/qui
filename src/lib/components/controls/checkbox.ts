import m, { FactoryComponent } from 'mithril'

import {
  getValue,
  component,
  setValue,
  ValueSource,
  ComponentAttrs,
  ComponentModel,
} from '../../core'
import { call, twuiClass, cssClass, viewFn } from '../../core/utils'

/**
 * Checkbox component attrs
 * @public
 */
export type CheckboxAttrs = ComponentAttrs<CheckboxModel>

/**
 * Describes a checkbox control
 * @public
 */
export interface CheckboxModel<T = unknown>
  extends ComponentModel,
    ValueSource<T, boolean> {
  /**
   * The type name of the control
   */
  type: 'checkbox'
  /**
   * This is called when the control value changes
   */
  onChange?: (model: CheckboxModel, value: unknown) => void
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
const CheckboxComponent: FactoryComponent<CheckboxAttrs> = (node) => {
  function onChange(e: Event) {
    const data = node.attrs.data
    const checked = (e.target as HTMLInputElement).checked
    const written = setValue(data, checked)
    call(data.onChange, data, written)
  }
  return {
    view: viewFn((data) => {
      const checked = getValue(data) === true
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

component(TYPE, CheckboxComponent)
