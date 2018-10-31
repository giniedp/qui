import m from 'mithril'

import { ControlDef, getComponent, isFunction, registerComponent, tap } from './utils'

/**
 * Describes a panel control
 */
export type PanelDef = ControlDef[]

interface Attrs {
  isRoot?: boolean
  data?: PanelDef
}

registerComponent('panel', (node: m.Vnode<Attrs>) => {
  function isVisible(data: ControlDef) {
    if (!data || isFunction(data.hidden) && data.hidden() || data.hidden === true) {
      return false
    }
    return getComponent(data.type) != null
  }

  return {
    view: () => {
      return tap(node.attrs.data, (data) => {
        const components = data.filter(isVisible).map((it) => m(getComponent(it.type), { data: it }))
        return m('div', {
          class: ['qui-panel', node.attrs.isRoot ? 'qui-panel-root' : ''].join(' '),
        }, ...components)
      })
    },
  }
})
