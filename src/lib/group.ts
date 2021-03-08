import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { use, twuiClass, cssClass, viewFn, call, scrollIntoView } from './utils'
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
   * The group title to display
   */
  title: string
  /**
   * If true, the children will be rendered
   */
  open?: boolean
  /**
   * If true, scrolls the opened panel into view on click
   *
   * @remarks
   * if this is a number, this is used as setTimeout delay
   */
  autoscroll?: boolean | number
  /**
   * Is called when this group has been opened
   */
  onOpen?: (group: GroupModel) => void
  /**
   * Is called when this group has been closed
   */
  onClose?: (group: GroupModel) => void
}

registerComponent<GroupAttrs>('group', (node) => {
  function onClick(e: MouseEvent) {
    use(node.attrs.data, (data) => {
      data.open = !data.open
      if (data.open) {
        call(data.onOpen, data)
        if (data.autoscroll) {
          setTimeout(() => scrollIntoView(e.target as HTMLElement), Number(data.autoscroll))
        }
      } else {
        call(data.onClose, data)
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

