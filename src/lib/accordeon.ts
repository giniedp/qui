import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { twuiClass, viewFn, scrollIntoView } from './utils'
import { PanelModel } from './panel'
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
   * If true, scrolls the opened group into view on click
   *
   * @remarks
   * if this is a number, this is used as setTimeout delay
   */
  autoscroll?: boolean | number
}

const emptyArray: GroupModel[] = []

registerComponent<AccordeonAtts>('accordeon', () => {
  let opened: number
  return {
    view: viewFn((data) => {
      const children = data.children || emptyArray
      let justOpened
      children.forEach((group, i) => {
        if (group.open && i !== opened) {
          justOpened = i
        }
      })
      opened = justOpened ?? opened
      return m.fragment({}, children.map((group, i) => {
        group.type = 'group'
        group.open = i === opened
        group.autoscroll = group.autoscroll ?? data.autoscroll
        return renderModel<GroupModel>(group)
      }))
    }),
  }
})
