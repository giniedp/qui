import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { twuiClass, viewFn } from './utils'
import { PanelModel } from './panel'
import { ComponentAttrs, ComponentGroupModel } from './types'

/**
 * Accordeon component attribuets
 * @public
 */
export type AccordeonAtts = ComponentAttrs<AccordeonModel>

/**
 * Accordeon component model
 * @public
 */
export interface AccordeonModel extends ComponentGroupModel<PanelModel> {
  /**
   * The type name of the control
   */
  type: 'accordeon'
  /**
   * The index of the opened tab
   */
  active?: number
  /**
   * If true, scrolls the opened panel into view on click
   */
  autoscroll?: boolean
}

const emptyArray: PanelModel[] = []

registerComponent<AccordeonAtts>('accordeon', (node) => {
  return {
    view: viewFn((data) => {
      const children = data.children || emptyArray
      const child = children[data.active]
      return m(
        'div',
        {
          class: twuiClass(data.type),
        },
        children.reduce((list, item, i) => {
          const isActive = child === item
          list.push(
            m(
              'label',
              {
                class: isActive ? 'is-active' : '',
                onclick: (e: MouseEvent) => {
                  data.active = isActive ? -1 : i
                  if (data.autoscroll) {
                    (e.target as any).scrollIntoView?.({ behavior: 'smooth', block: 'start'})
                  }
                },
              },
              item.label,
            ),
          )
          list.push(
            renderModel<PanelModel>({
              type: 'panel',
              children: item.children,
              style: item.style,
              hidden: !isActive,
            }),
          )
          return list
        }, []),
      )
    }),
  }
})
