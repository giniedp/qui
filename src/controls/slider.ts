import m from 'mithril'

import { NumberDef } from './number'
import { call, clamp, getValue, label, quiClass, registerComponent, setValue, use } from './utils'

interface Attrs {
  data: NumberDef
}

registerComponent('slider', (node: m.Vnode<Attrs>) => {
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

  function min(data: NumberDef) {
    return data.min == null ? 0 : data.min
  }

  function max(data: NumberDef) {
    return data.max == null ? 1 : data.max
  }
  function getPercent(data: NumberDef) {
    return Math.floor((getValue(data) - min(data)) / (max(data) - min(data)) * 100)
  }

  function limitValue(data: NumberDef, value: number) {
    value = clamp(value, min(data), max(data))
    if (data.step != null) {
      const digits = (data.step % 1).toString(10).length - 2
      value = parseFloat((Math.round(value / data.step) * data.step).toFixed(digits))
    }
    return value
  }

  let target: HTMLElement
  function dragStart(e: MouseEvent | TouchEvent) {
    target = e.target as HTMLElement
    drag(e)
  }

  function drag(e: MouseEvent | TouchEvent) {
    if (!target) {
      return
    }

    const rect = target.getBoundingClientRect()
    const tx = window.pageXOffset || document.documentElement.scrollLeft

    const cw = target.clientWidth
    const px = 'touches' in e ? e.touches.item(0).pageX : e.pageX
    const cx = (px - tx - rect.left) / cw
    use(node.attrs.data, (data) => {
      setValue(data, limitValue(data, (max(data) - min(data)) * cx + min(data)))
      call(data.onInput, data)
      m.redraw()
    })
  }

  function dragEnd() {
    if (target) {
      target = null
      use(node.attrs.data, (data) => {
        call(data.onChange, data)
        m.redraw()
      })
    }
  }

  function keydown(e: KeyboardEvent) {
    const code = e.key || e.keyCode
    const step = (code === 'ArrowLeft' ? -1 : code === 'ArrowRight' ? 1 : 0)
    if (step) {
      use(node.attrs.data, (data) => {
        setValue(data, limitValue(data, data.value + step * (data.step || 1)))
        call(data.onChange, data)
      })
    }
  }

  return {
    oncreate: () => {
      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', dragEnd)
    },
    onremove: () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', dragEnd)
    },
    view: () => {
      return use(node.attrs.data, (data) => {
        return m('div', { class: quiClass('slider'), key: data.key},
          label(data.label),
          m('section',
            m('div', {
              class: 'qui-progress',
              style: 'user-select: none;',
              tabindex: 0,
              onmousedown: dragStart,
              onmousemove: drag,
              onmouseup: dragEnd,

              ontouchstart: dragStart,
              ontouchmove: drag,
              ontouchend: dragEnd,
              ontouchcancel: dragEnd,
              onkeydown: keydown,
            }, m('div', { class: 'qui-progress-bar', style: `width: ${getPercent(data)}%; pointer-events: none; user-select: none;` })),
            m('input', {
              type: 'number',
              min: min(data),
              max: max(data),
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
