import m from 'mithril'

import {
  getValue,
  component,
  setValue,
  renderModel,
  ComponentAttrs,
  ComponentModel,
  ValueSource,
} from '../../core'
import { call, twuiClass, viewFn } from '../../core/utils'
import { NumberModel } from './number'

/**
 * @public
 */
export type PositionValue =
  | number[]
  | { [key: string]: number }
  | { [key: number]: number }

/**
 * Position component attributes
 * @public
 */
export type PositionAttrs = ComponentAttrs<PositionModel>

/**
 * Position component model
 * @public
 */
export type PositionModel<T = unknown> = ComponentModel &
  ValueSource<T, PositionValue> & {
    /**
     * The type name of the control
     */
    type: 'position'
    /**
     * The position object field names. Defaults to `['x', 'y', 'z']`
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
      model: PositionModel<T>,
      value: unknown,
      key?: string | number,
    ) => void
    /**
     * This is called once the control value is committed by the user.
     *
     * @remarks
     * Unlike the `onInput` callback, this is not necessarily called for each value change.
     */
    onChange?: (
      model: PositionModel<T>,
      value: unknown,
      key?: string | number,
    ) => void
    /**
     * Disables the control input
     */
    disabled?: boolean,
  }

const TYPE = 'position'
const defaultKeys = ['x', 'y', 'z']
component<PositionAttrs>(TYPE, (node) => {
  function onChange(type: 'input' | 'change', field: string, v: number) {
    const data = node.attrs.data
    const value: any = getValue(data) || {}
    value[field] = isNaN(v) ? null : v
    const written = setValue(data, value)
    call(type === 'input' ? data.onInput : data.onChange, data, written, field)
  }

  return {
    view: viewFn((data) => {
      const keys = data.keys || defaultKeys
      const value = getValue(data) as any
      return m(
        'div',
        {
          class: twuiClass(TYPE),
        },
        keys.map((field) => {
          return renderModel<NumberModel>({
            type: 'number',
            min: data.min,
            max: data.max,
            step: data.step,
            value: value?.[field],
            disabled: data.disabled,
            onInput: (_, v: number) => onChange('input', field, v),
            onChange: (_, v: number) => onChange('change', field, v),
            placeholder: field,
          })
        }),
      )
    }),
  }
})
