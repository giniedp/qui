import m, { Child } from 'mithril'

import {
  getValue,
  component,
  setValue,
  ComponentModel,
  ValueSource,
  ComponentAttrs,
} from '../../core'
import { call, isNumber, isString, twuiClass, viewFn } from '../../core/utils'

const emptyArray: any[] = []

/**
 * @public
 */
export type SelectOption = {
  label: string
  value: unknown
  disabled?: boolean
}
/**
 * @public
 */
export type SelectOptionArray = Array<
  SelectOption | SelectOptionGroup | string | number
>
/**
 * @public
 */
export type SelectOptionsObject = {
  [key: string]: unknown
}
/**
 * @public
 */
export type SelectOptionGroup<T = SelectOptionArray | SelectOptionsObject> = {
  label: string
  options: T
  disabled?: boolean
}

/**
 * Select component select options
 * @public
 */
export type SelectModelOptions = SelectOptionArray | SelectOptionsObject

/**
 * Select component attributes
 * @public
 */
export type SelectAttrs = ComponentAttrs<SelectModel>

/**
 * Select component model
 * @public
 */
export interface SelectModel<T = unknown, V = any>
  extends ComponentModel,
    ValueSource<T, V> {
  /**
   * The type name of the control
   */
  type: 'select'
  /**
   * The select options
   */
  options?: SelectModelOptions
  /**
   * This is called once the control value is committed by the user.
   */
  onChange?: (model: SelectModel<T>, value: unknown) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

function optionsFromFlatArray(arr: SelectOptionArray): SelectOption[] {
  const res: SelectOption[] = []
  for (const it of arr) {
    if (isString(it) || isNumber(it)) {
      res.push({ value: it, label: String(it) })
      continue
    }
    if ('value' in it) {
      res.push(it)
      continue
    }
  }
  return res
}

function optionsFromArray(
  arr: SelectOptionArray,
): Array<SelectOption | SelectOptionGroup<SelectOption[]>> {
  const res: Array<SelectOption | SelectOptionGroup<SelectOption[]>> = []
  for (const it of arr) {
    if (isString(it) || isNumber(it) || it == null) {
      res.push({ value: it, label: String(it) })
    } else if ('value' in it) {
      res.push(it)
    } else if ('options' in it) {
      res.push({
        label: it.label,
        disabled: it.disabled,
        options: Array.isArray(it.options)
          ? optionsFromFlatArray(it.options)
          : optionsFromObject(it.options),
      })
    }
  }
  return res
}

function optionsFromObject(obj: SelectOptionsObject): Array<SelectOption> {
  return Object.keys(obj)
    .sort()
    .map((key) => ({ value: obj[key], label: key }))
}

function getOptions(
  node: m.Vnode<SelectAttrs>,
): Array<SelectOption | SelectOptionGroup<SelectOption[]>> {
  const options = node.attrs.data.options

  if (!options) {
    return emptyArray
  }

  if (Array.isArray(options)) {
    return optionsFromArray(options)
  }
  return optionsFromObject(options)
}

component<SelectAttrs>('select', (node) => {
  let options: Array<SelectOption | SelectOptionGroup<SelectOption[]>>

  function getSelectedIndex() {
    const data = node.attrs.data
    const value = getValue(data)
    let i = 0
    for (const o0 of options) {
      if ('options' in o0) {
        for (const o1 of o0.options) {
          if (o1.value === value) {
            return i
          }
          i++
        }
      } else {
        if (o0.value === value) {
          return i
        }
        i++
      }
    }
  }

  function getSelectionAt(index: number) {
    let i = 0
    for (const o0 of options) {
      if ('options' in o0) {
        for (const o1 of o0.options) {
          if (i === index) {
            return o1.value
          }
          i += 1
        }
      } else {
        if (i === index) {
          return o0.value
        }
        i += 1
      }
    }
    return null
  }

  function onChange(e: Event) {
    const el = e.target as HTMLSelectElement
    const data = node.attrs.data
    const value = getSelectionAt(el.selectedIndex)
    const written = setValue(data, value)
    call(data.onChange, data, written)
  }

  return {
    view: viewFn((data) => {
      options = getOptions(node)
      return m(
        'select',
        {
          class: twuiClass(data.type),
          selectedIndex: getSelectedIndex(),
          onchange: onChange,
          disabled: data.disabled,
        },
        options.map((it) => {
          if ('options' in it) {
            return m(
              'optgroup',
              {
                disabled: !!it.disabled,
                label: it.label || '',
              },
              it.options.map(option),
            )
          }
          return option(it)
        }),
      )
    }),
  }
})

function option(it: SelectOption) {
  return m(
    'option',
    {
      value: it.value,
      label: it.label,
      disabled: !!it.disabled,
    },
    it.label || '',
  )
}
