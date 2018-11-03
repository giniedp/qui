import m from 'mithril'

import { call, ControlDef, getValue, label, quiClass, registerComponent, setValue, use } from './utils'

/**
 * Describes a number control
 */
export interface NumberDef<T = any> extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'number' | 'slider'
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
    setValue(data, isNaN(value) ? null : value)
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
        return m('div', { class: quiClass('number'), key: data.key },
          label(data.label),
          m('section',
            m('input', {
              type: 'number',
              min: data.min,
              max: data.max,
              step: data.step,
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
