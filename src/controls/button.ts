import m from 'mithril'

import { call, ControlDef, registerComponent, renderControl, use } from './utils'

/**
 * Describes a button control
 */
export interface ButtonDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'button'
  /**
   * The button text
   */
  text?: string
  /**
   * The on click action
   */
  onClick?: (ctrl: ButtonDef) => void
}

interface Attrs {
  data: ButtonDef
}

registerComponent('button', (node: m.Vnode<Attrs>) => {
  return {
    view: () => renderControl(node, (data) => m("button[type='button']", { onclick: () => call(data.onClick, data) }, data.text)),
  }
})
