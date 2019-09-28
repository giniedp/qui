import m from 'mithril'

import {
  ControlViewModel,
  getModelValue,
  registerComponent,
  renderControl,
  ValueSource,
} from './core'
import { call, isArray } from './utils'

/**
 * @public
 */
export type Vector =
  | number[]
  | { [key: string]: number }
  | { [key: number]: number }

/**
 * Describes a vector picker control
 * @public
 */
export interface VectorModel<T = any>
  extends ControlViewModel,
  ValueSource<T, Vector> {
  /**
   * The type name of the control
   */
  type: 'vector'
  /**
   * The vector object field names. Defaults to `['x', 'y', 'z']`
   */
  keys?: string[]
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
   * This is called when the control value has been changed.
   */
  onInput?: (model: VectorModel<T>, value: Vector) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: VectorModel<T>, value: Vector) => void
  /**
   * Disabled the control input
   */
  disabled?: boolean
}

interface Attrs {
  data: VectorModel
}

const defaultElements = ['x', 'y', 'z']

registerComponent('vector', (node: m.Vnode<Attrs>) => {
  function onChange(e: Event, field: string) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const value: any = getModelValue(data) || {}
    const v = parseFloat(el.value)
    value[field] = isNaN(v) ? null : v
    if (e.type === 'input') {
      call(data.onInput, data, value, field)
    }
    if (e.type === 'change') {
      call(data.onChange, data, value, field)
    }
  }

  return {
    view: () => {
      return renderControl(node, (data) => {
        const keys = data.keys || defaultElements
        const value = getModelValue(data) as any
        const visible = value && isArray(keys) && keys.length
        return !visible
          ? null
          : keys.map((field) => {
            return m("input[type='number']", {
              key: field,
              min: data.min,
              max: data.max,
              step: data.step,
              value: value[field],
              disabled: data.disabled,
              oninput: (e: Event) => onChange(e, field),
              onchange: (e: Event) => onChange(e, field),
              placeholder: field,
            })
          })
      })
    },
  }
})
