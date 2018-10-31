import m from 'mithril'

import { call, ControlDef, registerComponent, tap } from './utils'

/**
 * Describes a checkbox control
 */
export interface CheckboxDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'checkbox'
  /**
   * The value
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
    data.value = el.checked
    call(data.onChange, data)
  }

  return {
    view: (vnode: m.Vnode<Attrs>) => {
      return tap(vnode.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-checkbox', key: data.key },
          m('label',
            m('span', data.label),
            m('input', {
              type: 'checkbox',
              checked: data.value === true,
              onchange: onChange,
            }),
          ),
        )
      })
    },
  }
})
