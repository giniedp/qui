import m from 'mithril'

import { registerComponent, renderModel } from './core'
import { twuiClass, viewFn, isString } from './utils'
import {
  ComponentGroupModel,
  ComponentAttrs,
  ComponentModel,
} from './types'

/**
 * Panel component attributes
 * @public
 */
export type PanelAttrs = ComponentAttrs<PanelModel>

/**
 * Panel component model
 * @public
 */
export interface PanelModel extends ComponentGroupModel<ComponentModel> {
  /**
   * Component type name
   */
  type: 'panel'
  /**
   * Panel title
   */
  title?: string
  /**
   * Panel CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
}

const type = 'panel'
registerComponent<PanelAttrs>(type, () => {
  return {
    view: viewFn((data) =>
      m(
        'div',
        {
          class: twuiClass(type),
          style: data.style,
        },
        m.fragment({}, [
          data.title ? m('div', { class: twuiClass(type + '-title') }, data.title) : null,
        ]),
        m.fragment({}, data.children?.map((it) => {
          if (isString(it.label)) {
            return m(
              'div',
              { class: twuiClass('panel-control') },
              m('label', it.label),
              m('section', renderModel(it)),
            )
          }
          return renderModel(it)
        })),
      ),
    ),
  }
})
