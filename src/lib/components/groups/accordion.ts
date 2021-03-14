import m from 'mithril'

import { component, renderModel, ComponentAttrs, ComponentGroupModel } from '../../core'
import { viewFn } from '../../core/utils'
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
  type: 'accordion'
  /**
   * The index of the group that should be open initially
   */
  expand?: number
  /**
   * If true, scrolls the opened group into view on click
   *
   * @remarks
   * if this is a number, this is used as setTimeout delay
   */
  autoscroll?: boolean | number
}

const TYPE = 'accordion'
const EMPTY: GroupModel[] = []

component<AccordeonAtts>(TYPE, () => {
  return {
    view: viewFn((data) => {
      const children = data.children || EMPTY
      data.expand = detectExpanded(data.expand, children)
      return m.fragment({}, children.map((group, i) => {
        group.type = 'group'
        group.collapsible = true
        group.collapsed = i !== data.expand
        group.autoscroll = group.autoscroll ?? data.autoscroll
        return renderModel<GroupModel>(group)
      }))
    }),
  }
})

function detectExpanded(index: number, list: GroupModel[]) {
  let result = null
  for (let i = 0; i < list.length; i++) {
    if (!list[i].collapsed) {
      if (i !== index) {
        return i
      }
      if (result == null) {
        result = i
      }
    }
  }
  return result
}
