import m from 'mithril'

import { registerComponent } from './core'
import { call, use, twuiClass, viewFn } from './utils'
import { ComponentModel, ComponentAttrs } from './types'

/**
 * Image component attrs
 * @public
 */
export type ImageAttrs = ComponentAttrs<ImageModel>

/**
 * Image component model
 * @public
 */
export interface ImageModel extends ComponentModel {
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

registerComponent<ImageAttrs>('image', (node) => {
  const onClick = () => {
    use(node.attrs.data, (data) => call(data.onClick, data))
  }
  return {
    view: viewFn((data) => {
      return (Array.isArray(data.src) ? data.src : [data.src]).map((src) => {
        return m('img', {
          class: twuiClass(data.type),
          src: src,
          width: data.width,
          height: data.height,
          onclick: onClick,
        })
      })
    }),
  }
})
