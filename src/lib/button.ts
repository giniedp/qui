import m from 'mithril'

import { registerComponent } from './core'
import { ComponentAttrs, ComponentModel } from './types'
import { call, twuiClass, viewFn } from './utils'

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
registerComponent<ButtonAttrs>(type, (node) => {
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
