import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { clamp, twuiClass, viewFn } from './utils'
import { PanelModel } from './panel'
import { ComponentAttrs, ComponentGroupModel } from './types'

/**
 * Tabs component attributes
 * @public
 */
export type TabsAtts = ComponentAttrs<TabsModel>

/**
 * Tabs component model
 * @public
 */
export interface TabsModel extends ComponentGroupModel<PanelModel> {
  /**
   * The type name of the control
   */
  type: 'tabs'
  /**
   * The index of the opened tab
   */
  active: number
}

registerComponent<TabsAtts>('tabs', () => {
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
              it.label,
            )
          }),
        ),
        m.fragment({ key: `panel-${data.active}` }, [
          renderModel<PanelModel>({
            type: 'panel',
            children: tab.children,
          }),
        ]),
      )
    }),
  }
})
