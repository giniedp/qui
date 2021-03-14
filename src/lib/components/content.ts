import m, { Child } from 'mithril'

import { component, ComponentAttrs, ComponentModel } from '../core'
import { viewFn } from '../core/utils'

/**
 * Content component attributes
 * @public
 */
export type ContentAttrs = ComponentAttrs<ContentModel>

/**
 * Content component model
 * @public
 */
export interface ContentModel extends ComponentModel {
  /**
   * The type name of the control
   */
  type: 'content'
  /**
   * A mithril child
   */
  content?: Child
}

const CONTENT = 'content'

component<ContentAttrs>(CONTENT, () => {
  return {
    view: viewFn((data) => m.fragment({}, [data.content])),
  }
})
