import m from 'mithril'

import { call, ControlDef, label, registerComponent, tap } from './utils'

/**
 * Describes a number control
 */
export interface NumberDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'number' | 'range'
  /**
   * The placeholder text
   */
  placeholder?: string
  /**
   * The min value
   */
  min?: number
  /**
   * The max value
   */
  max?: number
  /**
   * The step value
   */
  step?: number
  /**
   * The actual value
   */
  value?: number
  /**
   * Will be called frequently during unput
   */
  onInput?: (value: NumberDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: NumberDef) => void
}

interface Attrs {
  data: NumberDef
}

registerComponent('number', (node: m.Vnode<Attrs>) => {

  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const value = parseFloat(el.value)
    data.value = isNaN(value) ? null : value
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
        return m('div', { class: 'qui-control qui-control-number', key: data.key },
          label(data.label),
          m('section',
            m('input', {
              type: 'number',
              min: data.min,
              max: data.max,
              step: data.step,
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
