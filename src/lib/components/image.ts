import m from 'mithril'

import { component, ComponentModel, ComponentAttrs } from '../core'
import { call, use, twuiClass, viewFn, isNumber, isString, cssClass } from '../core/utils'

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
   * Aspect ratio of the picture container
   */
  aspect?: string
  /**
   * A fixed width
   */
  width?: number | string
  /**
   *
   */
  fit?: 'contain' | 'cover' | 'fill'
  /**
   * This is callend when the control is clicked
   */
  onClick?: (ctrl: ImageModel) => void
}

const TYPE = 'image'
component<ImageAttrs>('image', (node) => {
  const onClick = () => {
    use(node.attrs.data, (data) => call(data.onClick, data))
  }
  function aspect(spec: string) {
    if (!spec) {
      return null
    }
    const [x, y] = (spec || '1x1').split('x').map(Number)
    const padding = ((y / x) || 1) * 100
    return `${padding}%`
  }
  function width(data: ImageModel) {
    if (isNumber(data.width)) {
      return `${data.width}px`
    }
    if (isString(data.width)) {
      return data.width
    }
  }
  return {
    view: viewFn((data) => {
      return (Array.isArray(data.src) ? data.src : [data.src]).map((src) => {
        return m(
          'picture',
          {
            class: cssClass({
              [twuiClass(TYPE)]: true,
              [twuiClass(TYPE, 'aspect')]: !!data.aspect,
            }),
            style: {
              '--twui-aspect': aspect(data.aspect),
              '--twui-fit': data.fit || 'fit',
              width: width(data),
            },
          },
          m('img', {
            src: src,
            onclick: onClick,
          }),
        )
      })
    }),
  }
})
