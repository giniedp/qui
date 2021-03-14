import m from 'mithril'

import {
  component,
  renderModel,
  ComponentGroupModel,
  ComponentAttrs,
  ComponentModel,
} from '../../core'
import { cssClass, twuiClass, viewFn } from '../../core/utils'

/**
 * Container component attributes
 * @public
 */
export type ContainerAttrs = ComponentAttrs<ContainerModel>

/**
 * Container component model
 * @public
 */
export interface ContainerModel extends ComponentGroupModel<ComponentModel> {
  /**
   * Component type name
   */
  type: 'container'
  /**
   * Enables horizontal layout
   */
  horizontal?: boolean
  /**
   * Custom CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
}

const TYPE = 'container'
component<ContainerAttrs>(TYPE, () => {
  return {
    view: viewFn((data) =>
      m(
        'div',
        {
          class: cssClass({
            [twuiClass(TYPE)]: true,
            [twuiClass(TYPE, 'horizontal')]: data.horizontal,
          }),
          style: data.style,
        },
        m.fragment({}, data.children?.map(renderModel)),
      ),
    ),
  }
})
