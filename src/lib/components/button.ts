import m from 'mithril'

import { component, ComponentAttrs, ComponentModel } from '../core'
import { call, twuiClass, viewFn } from '../core/utils'

/**
 * Button component attribuets
 * @public
 */
export type ButtonAttrs = ComponentAttrs<ButtonModel>

/**
 * Button component model
 * @public
 */
export interface ButtonModel extends ComponentModel {
  /**
   * The type name of the control
   */
  type: 'button'
  /**
   * The button text
   */
  text?: string
  /**
   * This is callend when the control is clicked
   */
  onClick?: (ctrl: ButtonModel) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

const type = 'button'
component<ButtonAttrs>(type, (node) => {
  return {
    view: viewFn((data) =>
      m(
        type,
        {
          type: type,
          class: twuiClass(type),
          onclick: () => call(data.onClick, data),
          disabled: data.disabled,
        },
        data.text,
      ),
    ),
  }
})
