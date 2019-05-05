import m from 'mithril'

import { ControlViewModel, getComponent, registerComponent } from './core'
import { isFunction } from './utils'

/**
 * Describes a panel control
 * @public
 */
export type PanelModel = ControlViewModel[]

interface Attrs {
  isRoot?: boolean
  data?: PanelModel
}

registerComponent('panel', (node: m.Vnode<Attrs>) => {
  function isVisible(data: ControlViewModel) {
    if (!data || isFunction(data.hidden) && data.hidden() || data.hidden === true) {
      return false
    }
    return getComponent(data.type) != null
  }

  return {
    view: () => {
      const data = node.attrs.data
      if (!data || !Array.isArray(data)) {
        return null
      }
      return m('div',
        {
          class: ['tweakui-panel', node.attrs.isRoot ? 'tweakui-panel-root' : ''].join(' '),
        },
        data.filter(isVisible).map((it) => m(getComponent(it.type), { data: it })),
      )
    },
  }
})
