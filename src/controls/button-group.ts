import m from 'mithril'

import { ButtonDef } from './button'
import { call, ControlDef, label, registerComponent, tap } from './utils'

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
  buttons: ButtonDef[]
}

interface Attrs {
  data: ButtonGroupDef
}

registerComponent('button-group', (node: m.Vnode<Attrs>) => {
  return {
    view: () => {
      return tap(node.attrs.data, (data) => {
        return m('div', { key: data.key, class: 'qui-control qui-control-button-group' },
          label(data.label),
          m('section',
            data.buttons.map((it) => {
              return m('button', { type: 'button', onclick: () => call(it.onClick, it) }, it.text)
            }),
          ),
        )
      })
    },
  }
})
