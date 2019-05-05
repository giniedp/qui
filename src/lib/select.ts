import m from 'mithril'

import { ControlViewModel, getModelValue, registerComponent, renderControl, setModelValue, ValueSource } from './core'
import { call, isNumber, isString } from './utils'

const emptyArray: any[] = []
const isSimpleArray = (arr: any): arr is Array<string | number> => {
  if (!arr || !Array.isArray(arr)) {
    return false
  }
  return arr.every((it) => isString(it) || isNumber(it))
}

/**
 * @public
 */
export type SelectModelOptions =
  { [key: string]: any } |
  Array<string | number> |
  Array<{ id: string, label: string, value: any }>

/**
 * Describes a select control
 * @public
 */
export interface SelectModel<T = any, V = any> extends ControlViewModel, ValueSource<T, V>  {
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
  onChange?: (model: SelectModel<T>, value: V) => void
  /**
   * Disabled the control input
   */
  disabled?: boolean
}

interface Attrs {
  data: SelectModel
}

function getOptions(node: m.Vnode<Attrs>): Array<{ id: string, value: any, label: string }> {
  const data = node.attrs.data
  if (!data || !data.options) {
    return emptyArray
  }

  const opts = data.options
  if (isSimpleArray(opts)) {
    return opts.map((it, index) => {
      return { id: String(index), value: it, label: String(it) }
    })
  }

  if (Array.isArray(opts)) {
    return opts as any
  }

  if (typeof opts === 'object') {
    return Object.keys(opts).sort().map((key) => {
      return { id: key, value: opts[key], label: key }
    })
  }
  return emptyArray
}

function getSelectedIndex(node: m.Vnode<Attrs>) {
  const data = node.attrs.data
  if (!data || !data.options) {
    return -1
  }

  const opts = data.options
  const value = getModelValue(data)
  if (isSimpleArray(opts)) {
    return opts.indexOf(value)
  }

  if (Array.isArray(opts)) {
    const found = opts.filter((it) => it.value === value)[0]
    return opts.indexOf(found)
  }

  if (typeof opts === 'object') {
    const keys = Object.keys(opts).sort()
    for (const key of keys) {
      if (value === opts[key]) {
        return keys.indexOf(key)
      }
    }
  }
  return null
}

function setSelection(node: m.Vnode<Attrs>, selectedIndex: number) {
  const data = node.attrs.data
  if (!data || !data.options) {
    return
  }

  const opts = data.options
  if (isSimpleArray(opts)) {
    setModelValue(data, opts[selectedIndex])
    return
  }

  if (Array.isArray(opts)) {
    const found = opts[selectedIndex]
    setModelValue(data, found ? found.value : null)
    return
  }

  if (typeof opts === 'object') {
    const key = Object.keys(opts).sort()[selectedIndex]
    setModelValue(data, key && key in opts ? opts[key] : null)
  }
}

registerComponent('select', (node: m.Vnode<Attrs>) => {

  function onChange(e: Event) {
    const el = e.target as HTMLSelectElement
    const data = node.attrs.data
    setSelection(node, el.selectedIndex)
    call(data.onChange, data, getModelValue(data))
  }

  return {
    view: () => {
      return renderControl(node, (data) => {
        return m('select',
          {
            selectedIndex: getSelectedIndex(node),
            onchange: onChange,
            disabled: data.disabled,
          },
          getOptions(node).map((it: any) => m('option', {
            value: it.value,
            label: it.label,
          }, it.label || '')),
        )
      })
    },
  }
})
