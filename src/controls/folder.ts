import m from 'mithril'

import { ControlDef, getComponent, registerComponent, tap } from './utils'

/**
 * Describes a folder control
 */
export interface FolderDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'folder'
  /**
   * If true, the children will be rendered
   */
  open?: boolean
  /**
   * The folder text
   */
  text?: string
  /**
   * Definitions of child controls
   */
  children?: ControlDef[]
}

interface Attrs {
  data: FolderDef
}

registerComponent('folder', (node: m.Vnode<Attrs>) => {

  function onClick() {
    const data = node.attrs.data
    data.open = !data.open
  }

  return {
    view: () => {
      return tap(node.attrs.data, (data) => {
        return m('div', { key: data.key, class: 'qui-control qui-control-folder' },
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
