import m from 'mithril'

import { ButtonDef } from './button'
import { call, ControlDef, registerComponent, renderControl } from './utils'

/**
 * Describes a button group
 */
export interface ButtonGroupDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'button-group'
  /**
   * Buttons for this group
   */
  children: ButtonDef[]
}

interface Attrs {
  data: ButtonGroupDef
}

registerComponent('button-group', (node: m.Vnode<Attrs>) => {
  return {
    view: () => {
      return renderControl(node, (data) => {
        const childern = data.children || []
        return childern.map((it) => {
          return m("button[type='button']", { onclick: () => call(it.onClick, it) }, it.text)
        })
      })
    },
  }
})
