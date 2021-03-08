import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { viewFn } from './utils'
import { ComponentAttrs, ComponentGroupModel } from './types'
import { GroupModel } from './group'

/**
 * Accordeon component attribuets
 * @public
 */
export type AccordeonAtts = ComponentAttrs<AccordeonModel>

/**
 * Accordeon component model
 * @public
 */
export interface AccordeonModel extends ComponentGroupModel<GroupModel> {
  /**
   * The type name of the control
   */
  type: 'accordeon'
  /**
   * The index of the group that should be open initially
   */
  active?: number
  /**
   * If true, scrolls the opened group into view on click
   *
   * @remarks
   * if this is a number, this is used as setTimeout delay
   */
  autoscroll?: boolean | number
}

const emptyArray: GroupModel[] = []

registerComponent<AccordeonAtts>('accordeon', () => {
  return {
    view: viewFn((data) => {
      const children = data.children || emptyArray
      data.active = detectOpened(data.active ?? 0, children)
      return m.fragment({}, children.map((group, i) => {
        group.type = 'group'
        group.open = i === data.active
        group.autoscroll = group.autoscroll ?? data.autoscroll
        return renderModel<GroupModel>(group)
      }))
    }),
  }
})

function detectOpened(opened: number, list: GroupModel[]) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].open && i !== opened) {
      return i
    }
  }
  return opened
}
