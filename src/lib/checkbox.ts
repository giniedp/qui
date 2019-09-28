import m from 'mithril'

import {
  ControlViewModel,
  getModelValue,
  registerComponent,
  renderControl,
  setModelValue,
  ValueSource,
} from './core'
import { call, controllCssClass, use } from './utils'

/**
 * Describes a checkbox control
 * @public
 */
export interface CheckboxModel<T = any>
  extends ControlViewModel,
    ValueSource<T, boolean> {
  /**
   * The type name of the control
   */
  type: 'checkbox' | 'checkbutton'
  /**
   * This is called when the control value changes
   */
  onChange?: (value: CheckboxModel) => void
  /**
   * The button text
   *
   * @remarks
   * only used if `type` is `checkbutton`
   */
  text?: string
  /**
   * Disabled the control input
   */
  disabled?: boolean
}

interface Attrs {
  data: CheckboxModel
}

registerComponent('checkbox', (node: m.Vnode<Attrs>) => {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    setModelValue(data, el.checked)
    call(data.onChange, data, el.checked)
  }

  return {
    view: (vnode: m.Vnode<Attrs>) => {
      return use(vnode.attrs.data, (data) => {
        return m(
          'div',
          { class: controllCssClass('checkbox'), key: data.key },
          m(
            'label',
            m('span', data.label),
            m('input', {
              type: 'checkbox',
              checked: getModelValue(data) === true,
              onchange: onChange,
            }),
          ),
        )
      })
    },
  }
})

registerComponent('checkbutton', (node: m.Vnode<Attrs>) => {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    setModelValue(data, el.checked)
    call(data.onChange, data, el.checked)
  }

  return {
    view: () => {
      return renderControl(node, (data) => {
        const checked = getModelValue(data) === true
        return [
          m(
            "button[type='button']",
            {
              class: checked ? 'active' : null,
              onclick: () => {
                setModelValue(data, !checked)
              },
              disabled: data.disabled,
            },
            m('input', {
              type: 'checkbox',
              style: { display: 'none' },
              checked: checked,
              onchange: onChange,
            }),
            data.text,
          ),
        ]
      })
    },
  }
})
