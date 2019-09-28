import m from 'mithril'

import { ControlViewModel, registerComponent, renderControl } from './core'
import { call } from './utils'

/**
 * Describes a button control
 * @public
 */
export interface ButtonModel extends ControlViewModel {
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
   * Disabled the control input
   */
  disabled?: boolean
}

interface Attrs {
  data: ButtonModel
}

registerComponent('button', (node: m.Vnode<Attrs>) => {
  return {
    view: () =>
      renderControl(node, (data) =>
        m(
          "button[type='button']",
          {
            onclick: () => call(data.onClick, data),
            disabled: data.disabled,
          },
          data.text,
        ),
      ),
  }
})
