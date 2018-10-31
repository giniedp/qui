import m from 'mithril'

import { call, ControlDef, label, registerComponent, tap } from './utils'

/**
 * Describes a text control
 */
export interface TextDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'text'
  /**
   * The placeholder text
   */
  placeholder?: string
  /**
   * The value
   */
  value?: string
  /**
   * Will be called frequently during unput
   */
  onInput?: (value: TextDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: TextDef) => void
}

interface Attrs {
  data: TextDef
}

registerComponent('text', (node: m.Vnode<Attrs>) => {

  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    data.value = el.value
    if (e.type === 'input') {
      call(data.onInput, data)
    }
    if (e.type === 'change') {
      call(data.onChange, data)
    }
  }

  return {
    view: () => {
      return tap(node.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-text', key: data.key },
          label(data.label),
          m('section',
            m('input', {
              type: 'text',
              value: data.value,
              oninput: onChange,
              onchange: onChange,
              placeholder: data.placeholder,
            }),
          ),
        )
      })
    },
  }
})
