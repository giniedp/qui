import m from 'mithril'

import { ControlDef, getComponent, quiClass, registerComponent } from './utils'

/**
 * Describes a group control
 */
export interface GroupDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'group'
  /**
   * If true, the children will be rendered
   */
  open?: boolean
  /**
   * Definitions of child controls
   */
  children?: ControlDef[]
}

type GroupNode = m.Vnode<Attrs>

interface Attrs {
  data: GroupDef
}

registerComponent('group', (node: GroupNode) => {
  function onClick() {
    const data = node.attrs.data
    data.open = !data.open
  }
  return {
    view: () => {
      const data = node.attrs.data
      return !data ? null : m('div', { key: data.key, class: quiClass('group') },
        m('label', { onclick: onClick, class: data.open ? 'is-open' : '' }, data.label),
        !data.open || !data.children || !data.children.length
          ? null
          : m(getComponent('panel'), { data: data.children },
        ),
      )
    },
  }
})
