import m from 'mithril'

import { ControlDef, label, quiClass, registerComponent, use } from './utils'

/**
 * Describes an image control
 */
export interface ImageDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'image'
  /**
   * The image source url
   */
  src?: string
}

interface Attrs {
  data: ImageDef
}

registerComponent('image', (node: m.Vnode<Attrs>) => {

  return {
    view: () => {
      return use(node.attrs.data, (data) => {
        return m('div', { class: quiClass('image'), key: data.key },
          label(data.label),
          m('section',
            m('img', { src: data.src }),
          ),
        )
      })
    },
  }
})
