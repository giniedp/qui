import m from 'mithril'

import { clamp, ControlDef, getComponent, registerComponent, renderControl } from './utils'

/**
 * Describes a button group
 */
export interface TabsDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'tabs'
  /**
   * The index of the opened tab
   */
  active: number
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

type TabsNode = m.Vnode<Attrs>

interface Attrs {
  data: TabsDef
}

registerComponent('tabs', (node: TabsNode) => {
  return {
    view: () => {
      const data = node.attrs.data
      const tabs = data ? data.children : []
      const active = clamp(data ? data.active || 0 : 0, 0, tabs.length - 1)
      const tab = tabs[active]

      return [
        renderControl(node, (d) => {
          return tabs.map((it, index) => {
            return m("button[type='button']", {
              key: it.key,
              onclick: () => d.active = index,
              class: active === index ? 'tab-active' : '',
            }, it.label)
          })
        }),
        ...tabs.map((it) => {
          if (it === tab) {
            return m(getComponent('panel'), { key: active, data: it.children })
          }
        }),
      ]
    },
  }
})
