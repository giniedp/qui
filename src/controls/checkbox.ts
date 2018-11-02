import m from 'mithril'

import { call, ControlDef, getValue, registerComponent, setValue, use } from './utils'

/**
 * Describes a checkbox control
 */
export interface CheckboxDef<T = any> extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'checkbox'
  /**
   * The target object where to get/set the value
   *
   * @remarks
   * Requires the `property` option to be set.
   */
  target?: T
  /**
   * The property name of `target` object
   *
   * @remarks
   * Requires the `target` option to be set.
   */
  property?: keyof T
  /**
   * If `target` and `property` are not set, then this value will be used
   */
  value?: boolean
  /**
   * The on click action
   */
  onChange?: (value: CheckboxDef) => void
}

interface Attrs {
  data: CheckboxDef
}

registerComponent('checkbox', (node: m.Vnode<Attrs>) => {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    setValue(data, el.checked)
    call(data.onChange, data)
  }

  return {
    view: (vnode: m.Vnode<Attrs>) => {
      return use(vnode.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-checkbox', key: data.key },
          m('label',
            m('span', data.label),
            m('input', {
              type: 'checkbox',
              checked: getValue(data) === true,
              onchange: onChange,
            }),
          ),
        )
      })
    },
  }
})
