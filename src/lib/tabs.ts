import m from 'mithril'

import { ControlViewModel, getComponent, registerComponent, renderControl } from './core'
import { clamp } from './utils'

/**
 * Describes a tabs control
 * @public
 */
export interface TabsModel extends ControlViewModel {
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
  children: TabData[]
}

/**
 * Describes a tab control
 * @public
 */
export interface TabData extends ControlViewModel {
  /**
   * Buttons for this group
   */
  children: ControlViewModel[]
}

type TabsNode = m.Vnode<Attrs>

interface Attrs {
  data: TabsModel
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
