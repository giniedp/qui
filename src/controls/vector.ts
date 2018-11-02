import m from 'mithril'

import { call, ControlDef, isArray, label, registerComponent, use } from './utils'

/**
 * Describes a vector picker control
 */
export interface VectorDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'vector'
  /**
   * The vector object field names. Defaults to `['x', 'y', 'z']`
   */
  elements?: string[]
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
   * The vector object
   */
  value?: number[] | { [index: string]: number }
  /**
   * Will be called frequently during unput
   */
  onInput?: (value: VectorDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: VectorDef) => void
}

interface Attrs {
  data: VectorDef
}

registerComponent('vector', (node: m.Vnode<Attrs>) => {
  use(node.attrs.data, (data) => {
    data.elements = data.elements || ['x', 'y', 'z']
  })
  function onChange(e: Event, field: string) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const value = parseFloat(el.value)
    if (data.value) {
      (data.value as any)[field] = isNaN(value) ? null : value
    }
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
        return m('div', { class: 'qui-control qui-control-vector', key: data.key },
          label(data.label),
          m('section',
            !data.value || !isArray(data.elements) ? null : data.elements.map((field) => {
              return m('input', {
                key: field,
                type: 'number',
                min: data.min,
                max: data.max,
                step: data.step,
                value: data.value[field],
                oninput: (e: Event) => onChange(e, field),
                onchange: (e: Event) => onChange(e, field),
                placeholder: field,
              })
            }),
          ),
        )
      })
    },
  }
})
