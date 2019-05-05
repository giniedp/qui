import m from 'mithril'

import { ControlViewModel, registerComponent, renderControl } from './core'
import { call } from './utils'

/**
 * Describes an image control
 * @public
 */
export interface ImageModel extends ControlViewModel {
  /**
   * The type name of the control
   */
  type: 'image'
  /**
   * The image source url
   */
  src?: string | string[]
  /**
   * The width attribute
   */
  width?: number
  /**
   * The height attribute
   */
  height?: number
  /**
   * This is callend when the control is clicked
   */
  onClick?: (ctrl: ImageModel) => void
}

interface Attrs {
  data: ImageModel
}

registerComponent('image', (node: m.Vnode<Attrs>) => {
  const onClick = () => call(node.attrs.data.onClick, node.attrs.data)
  return {
    view: () => {
      return renderControl(node, (data) => {
        return (Array.isArray(data.src) ? data.src : [data.src]).map((src) => {
          return m('img', { src: src, width: data.width, height: data.height, onclick: onClick })
        })
      })
    },
  }
})
