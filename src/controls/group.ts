import m from 'mithril'

import { ControlDef, getComponent, registerComponent, use } from './utils'

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

interface Attrs {
  data: GroupDef
}

registerComponent('group', (node: m.Vnode<Attrs>) => {

  function onClick() {
    const data = node.attrs.data
    data.open = !data.open
  }

  return {
    view: () => {
      return use(node.attrs.data, (data) => {
        return m('div', { key: data.key, class: 'qui-control qui-control-group' },
          m(
            'label',
            { onclick: onClick },
            m(
              'span', { class: data.open ? 'is-open' : '' }),
              data.label || '',
            ),
            !data.open || !data.children ? null : m(getComponent('panel'), { data: data.children },
          ),
        )
      })
    },
  }
})
