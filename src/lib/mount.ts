import type { ComponentModel } from './core/types'
import { default as m } from 'mithril'
import { Builder, BuilderFn } from './builder'
import { isFunction } from './core/utils'
import { renderModel } from './core'
import { GroupModel } from './components'

/**
 * Mithril's hyperscript function.
 *
 * @public
 * @remarks
 * Useful to create custom components
 */
export const h = m

/**
 * Runs the function through a builder system and returns the created controls
 *
 * @param fn - The builder function
 * @returns
 */
export function build(fn: BuilderFn) {
  const builder = new Builder()
  fn(builder)
  return builder.controls
}

/**
 * Mounts a ui to the given element
 *
 * @public
 * @param el - The ui host element
 * @param data - The ui definition object
 */
export function mount<T extends ComponentModel>(el: Element | string, data: T | Array<T> | BuilderFn) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  el.classList.add('twui-root')
  if (!data) {
    m.mount(el, null)
  } else if (Array.isArray(data)) {
    m.mount(el, {
      view: () =>
        renderModel<GroupModel>({
          type: 'group',
          children: data,
        }),
    })
  } else if (isFunction(data)) {
    const builder = new Builder()
    data(builder)
    m.mount(el, {
      view: () =>
        renderModel<GroupModel>({
          type: 'group',
          children: builder.controls,
        }),
    })
  } else {
    m.mount(el, {
      view: () => renderModel(data),
    })
  }
}

/**
 * Unmounts the ui from given host element
 *
 * @public
 * @param el - The ui host element
 */
export function unmount(el: Element | string) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  m.mount(el, null)
}

/**
 * Redraws the ui
 *
 * @public
 * @remarks
 * When changing the ui description object qui callbacks (e.g. `onInput` or `onChange`)
 * the ui will redraw automatically.
 *
 * However if the ui description object is changed from outside the qui callback
 * then this method must be called in order to update the visual state.
 */
export function redraw() {
  m.redraw()
}
