import m from 'mithril'

import {
  component,
  renderModel,
  ComponentGroupModel,
  ComponentAttrs,
  ComponentModel,
} from '../../core'
import { twuiClass, viewFn, isString, use, call, cssClass } from '../../core/utils'

/**
 * Group component attributes
 * @public
 */
export type GroupAttrs = ComponentAttrs<GroupModel>

/**
 * Group component model
 * @public
 */
export interface GroupModel extends ComponentGroupModel<ComponentModel> {
  /**
   * Component type name
   */
  type: 'group'
  /**
   * Group title
   */
  title?: string
  /**
   * Group CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
  /**
   * Whether the child elements can be collapsed
   */
  collapsible?: boolean
  /**
   * Whether the child elements are collapsed
   */
  collapsed?: boolean
  /**
   * Adds an offset to the left side
   */
  inset?: boolean
  /**
   * Is called when this Group has been collapsed or expanded
   */
  onToggle?: (group: GroupModel) => void
  /**
   * Is called when this Group has been expanded
   */
  onExpand?: (group: GroupModel) => void
  /**
   * Is called when this Group has been collapsed
   */
  onCollapse?: (group: GroupModel) => void
}

const TYPE = 'group'
component<GroupAttrs>(TYPE, (node) => {
  function onClick(e: MouseEvent) {
    use(node.attrs.data, (data) => {
      data.collapsed = !data.collapsed
      call(data.onToggle, data)
      if (data.collapsed) {
        call(data.onCollapse, data)
      } else {
        call(data.onExpand, data)
      }
    })
  }
  function title(data: GroupModel) {
    if (!data.title && !data.collapsible) {
      return null
    }
    return m(
      'div',
      {
        class: twuiClass(TYPE, 'title'),
        onclick: data.collapsible ? onClick : null,
      },
      data.title,
    )
  }
  function children(data: GroupModel) {
    if (data.collapsed || !data.children) {
      return []
    }
    return data.children?.map((it) => {
      if (isString(it.label)) {
        return m(
          'div',
          { class: twuiClass(TYPE, 'control') },
          m('label', it.label),
          m('section', renderModel(it)),
        )
      }
      return renderModel(it)
    })
  }

  return {
    view: viewFn((data) =>
      m(
        'div',
        {
          class: cssClass({
            [twuiClass(TYPE)]: true,
            [twuiClass(TYPE, 'collapsible')]: data.collapsible,
            [twuiClass(TYPE, 'collapsed')]: data.collapsed,
          }) ,
          style: data.style,
        },
        m.fragment({}, [title(data)]),
        m.fragment({}, [children(data)]),
      ),
    ),
  }
})
