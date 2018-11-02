import m from 'mithril'

import { call, ControlDef, getValue, isNumber, isString, label, quiClass, registerComponent, setValue, use } from './utils'

const emptyArray: any[] = []
const isSimpleArray = (arr: any): arr is Array<string | number> => {
  if (!arr || !Array.isArray(arr)) {
    return false
  }
  return arr.every((it) => isString(it) || isNumber(it))
}

export type SelectOptions =
  { [key: string]: any } |
  Array<string | number> |
  Array<{ id: string, label: string, value: any }>

/**
 * Describes a select control
 */
export interface SelectDef<T = any> extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'select'
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
  value?: any
  /**
   * The select options
   */
  options?: SelectOptions
  /**
   * Will be called frequently during unput
   */
  onInput?: (value: SelectDef) => void
  /**
   * Will be called once after input change
   */
  onChange?: (value: SelectDef) => void
}

interface Attrs {
  data: SelectDef
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
  const value = getValue(data)
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
    setValue(data, opts[selectedIndex])
    return
  }

  if (Array.isArray(opts)) {
    const found = opts[selectedIndex]
    setValue(data, found ? found.value : null)
    return
  }

  if (typeof opts === 'object') {
    const key = Object.keys(opts).sort()[selectedIndex]
    setValue(data, key && key in opts ? opts[key] : null)
  }
}

registerComponent('select', (node: m.Vnode<Attrs>) => {

  function onChange(e: Event) {
    const el = e.target as HTMLSelectElement
    const data = node.attrs.data
    setSelection(node, el.selectedIndex)
    call(data.onChange, data)
  }

  return {
    view: () => {
      return use(node.attrs.data, (data) => {
        return m('div', { class: quiClass('select'), key: data.key },
          label(data.label),
          m('section',
            m('select',
              {
                selectedIndex: getSelectedIndex(node),
                onchange: onChange,
              },
              getOptions(node).map((it: any) => m('option', {
                value: it.value,
                label: it.label,
              }, it.label || '')),
            ),
          ),
        )
      })
    },
  }
})
