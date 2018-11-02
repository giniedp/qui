import m from 'mithril'

import { call, ControlDef, label, quiClass, registerComponent, use } from './utils'

/**
 * Describes a button control
 */
export interface ButtonDef extends ControlDef {
  /**
   * The type name of the control
   */
  // type: 'button'
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
  function onClick() {
    use(node.attrs.data, (data) => call(data.onClick, data))
  }

  return {
    view: () => {
      return use(node.attrs.data, (data) => {
        return m('div', { key: data.key, class: quiClass('button') },
          label(data.label),
          m('section',
            m('button', {
              type: 'button',
              onclick: onClick,
            }, data.text),
          ),
        )
      })
    },
  }
})
