import m from 'mithril'

import { clamp, ControlDef, getComponent, registerComponent, use } from './utils'

/**
 * Describes a button group
 */
export interface TabsDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'tabs'
  /**
   * Buttons for this group
   */
  children: TabDef[]
}

/**
 * Describes a button group
 */
export interface TabDef extends ControlDef {
  /**
   * Buttons for this group
   */
  children: ControlDef[]
}

interface Attrs {
  data: TabsDef
}

registerComponent('tabs', (node: m.Vnode<Attrs>) => {
  let selection = 0
  function selectTab(index: number) {
    selection = index
  }

  return {
    view: () => {
      return use(node.attrs.data, (data) => {
        const tabs = data.children || []
        if (tabs.length === 0) {
          return null
        }
        selection = clamp(selection, 0, tabs.length - 1)
        return m('div', { key: data.key, class: 'qui-control qui-control-tabs' },
          ...(tabs.map((it, index) => {
            return m('button', {
              key: it.key,
              class: selection === index ? 'tab-active' : '',
              type: 'button', onclick: () => selectTab(index),
            }, it.label )
          })),
          ...(tabs.map((it, index) => index !== selection ? null : m(getComponent('panel'), { key: selection, data: it.children }) )),
        )
      })
    },
  }
})
