import m from 'mithril'

import { ControlDef, registerComponent, renderControl } from './utils'

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
      return renderControl(node, (data) => {
        return m('img', { src: data.src })
      })
    },
  }
})
