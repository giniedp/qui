import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { use, twuiClass, cssClass, viewFn } from './utils'
import { PanelModel } from './panel'
import { ComponentAttrs, ComponentGroupModel } from './types'

/**
 * Group component attributes
 *
 * @public
 */
export type GroupAttrs = ComponentAttrs<GroupModel>

/**
 * Group component model
 *
 * @public
 */
export interface GroupModel extends ComponentGroupModel {
  /**
   * The type name of the control
   */
  type: 'group'
  /**
   *
   */
  title: string
  /**
   * If true, the children will be rendered
   */
  open?: boolean
  /**
   * If true, scrolls the opened panel into view on click
   */
  autoscroll?: boolean
}

registerComponent<GroupAttrs>('group', (node) => {
  function onClick(e: MouseEvent) {
    use(node.attrs.data, (data) => {
      data.open = !data.open
      if (data.open && data.autoscroll) {
        (e.target as any).scrollIntoView?.({ behavior: 'smooth', block: 'start'})
      }
    })
  }
  return {
    view: viewFn((data) =>
      m(
        'div',
        {
          class: cssClass({
            [twuiClass(data.type)]: true,
            [twuiClass(data.type + 'open')]: data.open,
          }),
        },
        m(
          'label',
          { onclick: onClick, class: data.open ? 'is-active' : '' },
          data.title,
        ),
        renderModel<PanelModel>({
          type: 'panel',
          children: data.children,
          hidden: !data.open,
        }),
      ),
    ),
  }
})

