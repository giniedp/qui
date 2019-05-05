import m from 'mithril'

import { ButtonModel } from './button'
import { ControlViewModel, registerComponent, renderControl } from './core'
import { call } from './utils'

/**
 * Describes a button group
 * @public
 */
export interface ButtonGroupModel extends ControlViewModel {
  /**
   * The type name of the control
   */
  type: 'button-group'
  /**
   * Buttons for this group
   */
  children: ButtonModel[]
}

interface Attrs {
  data: ButtonGroupModel
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
