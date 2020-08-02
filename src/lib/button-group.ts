import m from 'mithril'

import { ButtonModel } from './button'
import { registerComponent, renderModel } from './core'
import { cssClass, twuiClass, viewFn } from './utils'
import { ComponentModel, ComponentAttrs } from './types'

/**
 * Button group component attributes
 *
 * @public
 */
export type ButtonGroupAttrs = ComponentAttrs<ButtonGroupModel>

/**
 * Button group component model
 *
 * @public
 */
export interface ButtonGroupModel extends ComponentModel {
  /**
   * The type name of the control
   */
  type: 'button-group'
  /**
   * Buttons for this group
   */
  children: Array<ButtonModel>
  /**
   * If true, buttons are stacked vertically
   */
  vertical?: boolean
}

registerComponent<ButtonGroupAttrs>('button-group', () => {
  return {
    view: viewFn((data) =>
      m(
        'div',
        {
          class: cssClass({
            [twuiClass(data.type)]: true,
            [twuiClass(data.type + '-vertical')]: data.vertical,
          }),
        },
        data.children?.map((it) => {
          it.type = 'button'
          return renderModel<ButtonModel>(it)
        }),
      ),
    ),
  }
})
