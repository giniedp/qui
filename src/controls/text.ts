import m from 'mithril'

import { call, ControlDef, getValue, label, quiClass, registerComponent, setValue, use } from './utils'

/**
 * Describes a text control
 */
export interface TextDef<T = any> extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'text'
  /**
   * The placeholder text
   */
  placeholder?: string
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
    setValue(data, el.value)
    if (e.type === 'input') {
      call(data.onInput, data)
    }
    if (e.type === 'change') {
      call(data.onChange, data)
    }
  }

  return {
    view: () => {
      return use(node.attrs.data, (data) => {
        return m('div', { class: quiClass('text'), key: data.key },
          label(data.label),
          m('section',
            m('input', {
              type: 'text',
              value: getValue(data),
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
