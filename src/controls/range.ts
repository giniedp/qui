import m from 'mithril'

import { NumberDef } from './number'
import { call, label, registerComponent, tap } from './utils'

interface Attrs {
  data: NumberDef
}

registerComponent('range', (node: m.Vnode<Attrs>) => {
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const data = node.attrs.data
    const value = parseFloat(el.value)
    data.value = isNaN(value) ? null : value
    if (e.type === 'input') {
      call(data.onInput, data)
    }
    if (e.type === 'change') {
      call(data.onChange, data)
    }
  }

  function getPercent(data: NumberDef) {
    return (((data.value - data.min) / (data.max - data.min)) * 100) | 0 //tslint:disable-line
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
    let clientX = 0
    if ('clientX' in e) {
      clientX = e.clientX
    } else if ('touches' in e) {
      clientX = e.touches.item(0).clientX
    }
    clientX -= target.offsetLeft
    let width = target.clientWidth
    const d = node.attrs.data
    const v = (d.max - d.min) * ((clientX / width) || 0) + d.min
    d.value = v < d.min ? d.min : v > d.max ? d.max : v
    m.redraw()
  }

  function dragEnd() {
    target = null
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
      return tap(node.attrs.data, (data) => {
        return m('div', { class: 'qui-control qui-control-range', key: data.key},
          label(data.label),
          m('section',
            m('div', {
              class: 'progress',
              style: 'user-select: none;',
              onmousedown: dragStart,
              onmousemove: drag,
              onmouseup: dragEnd,

              ontouchstart: dragStart,
              ontouchmove: drag,
              ontouchend: dragEnd,
              ontouchcancel: dragEnd,
            }, m('div', { class: 'progress-bar', style: `width: ${getPercent(data)}%; pointer-events: none; user-select: none;` })),
            m('input', {
              type: 'number',
              min: data.min,
              max: data.max,
              step: data.step,
              value: data.value,
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
