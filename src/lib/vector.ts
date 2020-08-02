import m from 'mithril'

import {
  getModelValue,
  registerComponent,
  setModelValue,
  renderModel,
} from './core'
import { call, twuiClass, viewFn } from './utils'
import { ComponentAttrs, ComponentModel, ValueSource } from './types'
import { NumberModel } from './number'

/**
 * @public
 */
export type VectorValue =
  | number[]
  | { [key: string]: number }
  | { [key: number]: number }

/**
 * Vector component attributes
 * @public
 */
export type VectorAttrs = ComponentAttrs<VectorModel>

/**
 * Vector component model
 * @public
 */
export interface VectorModel<T = any>
  extends ComponentModel,
    ValueSource<T, VectorValue> {
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
  onInput?: (
    model: VectorModel<T>,
    value: VectorValue,
    key?: string | number,
  ) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (
    model: VectorModel<T>,
    value: VectorValue,
    key?: string | number,
  ) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

const defaultKeys = ['x', 'y', 'z']
const compType = 'vector'
registerComponent<VectorAttrs>(compType, (node) => {
  function onChange(type: 'input' | 'change', field: string, v: number) {
    const data = node.attrs.data
    const value: any = getModelValue(data) || {}
    value[field] = isNaN(v) ? null : v
    setModelValue(data, value)
    call(type === 'input' ? data.onInput : data.onChange, data, value, field)
  }

  return {
    view: viewFn((data) => {
      const keys = data.keys || defaultKeys
      const value = getModelValue(data) as any
      return m(
        'div',
        {
          class: twuiClass(compType),
        },
        keys.map((field) => {
          return renderModel<NumberModel>({
            type: 'number',
            min: data.min,
            max: data.max,
            step: data.step,
            value: value?.[field],
            disabled: data.disabled,
            onChange: (_, v) => onChange('change', field, v),
            onInput: (_, v) => onChange('input', field, v),
            placeholder: field,
          })
        }),
      )
    }),
  }
})

