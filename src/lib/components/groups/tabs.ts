import m from 'mithril'

import {
  component,
  renderModel,
  ComponentAttrs,
  ComponentGroupModel,
} from '../../core'
import { clamp, twuiClass, viewFn } from '../../core/utils'
import { GroupModel } from './group'

/**
 * Tabs component attributes
 * @public
 */
export type TabsAtts = ComponentAttrs<TabsModel>

/**
 * Tabs component model
 * @public
 */
export interface TabsModel extends ComponentGroupModel<GroupModel> {
  /**
   * The type name of the control
   */
  type: 'tabs'
  /**
   * The index of the opened tab
   */
  active: number
}

component<TabsAtts>('tabs', () => {
  return {
    view: viewFn((data) => {
      const tabs = data.children || []
      const active = clamp(data.active || 0, 0, tabs.length - 1)
      const tab = tabs[active]
      return m(
        'div',
        {
          class: twuiClass(data.type),
        },
        m(
          'div',
          {
            key: `${data.type}-list`,
            class: twuiClass(`${data.type}-list`),
          },
          tabs.map((it, index) => {
            return m(
              "button[type='button']",
              {
                key: `${data.type}-${index}`,
                onclick: () => (data.active = index),
                class: active === index ? 'is-active' : '',
              },
              it.label || it.title,
            )
          }),
        ),
        m.fragment({ key: `panel-${data.active}` }, [
          renderModel<GroupModel>({
            type: 'group',
            children: tab.children,
            style: tab.style,
          }),
        ]),
      )
    }),
  }
})
