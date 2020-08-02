import m, { Child } from 'mithril'

import { registerComponent } from './core'
import { ComponentAttrs, ComponentModel } from './types'
import { viewFn, twuiClass } from './utils'

/**
 * Custom component attributes
 * @public
 */
export type CustomAttrs = ComponentAttrs<CustomModel>

/**
 * Custom component model
 * @public
 */
export interface CustomModel extends ComponentModel {
  /**
   * The type name of the control
   */
  type: 'custom'
  /**
   * The custom child node
   */
  node?: Child
}

const type = 'custom'

registerComponent<CustomAttrs>(type, () => {
  return {
    view: viewFn((data) =>
      m(
        'div',
        { class: twuiClass(type) },
        data.node,
      ),
    ),
  }
})
