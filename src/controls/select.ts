import m from 'mithril'

import { call, ControlDef, isString, label, registerComponent, tap } from './utils'

const emptyArray: any[] = []
const isArrayOfStrings = (arr: any): arr is string[] => {
  if (!arr || !Array.isArray(arr)) {
    return false
  }
  return arr.every(isString)
}

/**
 * Describes a select control
 */
export interface SelectDef extends ControlDef {
  /**
   * The type name of the control
   */
  type: 'select'
  /**
   * The selected value
   */
  value?: any
  /**
   * The select options
   *
   * @remarks
   */
  options?: string[] | { [key: string]: any } | Array<{ id: string, label: string, value: any }>
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
  if (isArrayOfStrings(opts)) {
    return opts.map((it, index) => {
      return { id: String(index), value: it, label: it }
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
  if (isArrayOfStrings(opts)) {
    return opts.indexOf(data.value)
  }

  if (Array.isArray(opts)) {
    const found = opts.filter((it) => it.value === data.value)[0]
    return opts.indexOf(found)
  }

  if (typeof opts === 'object') {
    const keys = Object.keys(opts).sort()
    for (const key of keys) {
      if (data.value === opts[key]) {
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
  if (isArrayOfStrings(opts)) {
    data.value = opts[selectedIndex]
    return
  }

  if (Array.isArray(opts)) {
    const found = opts[selectedIndex]
    data.value = found ? found.value : null
    return
  }

  if (typeof opts === 'object') {
    const key = Object.keys(opts).sort()[selectedIndex]
    data.value = key && key in opts ? opts[key] : null
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
      return tap(node.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-select', key: data.key },
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
