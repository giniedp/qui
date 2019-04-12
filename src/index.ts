import m from 'mithril'
import './controls'
import { Builder } from './controls/builder'

import * as u from './controls/utils'

declare const VERSION_STRING: string

export const VERSION = VERSION_STRING

/**
 * Mithril's hyperscript function.
 *
 * @remarks
 * Useful to create custom components
 */
export const h = m

/**
 * Mounts a ui to the given element
 *
 * @param el The ui host element
 * @param data The ui description object
 */
export function mount(el: Element, data: u.ControlDef[]) {
  return m.mount(el, { view: () => m(u.getComponent('panel'), { isRoot: true, data: data }) })
}

/**
 * Unmounts the ui from given host element
 *
 * @param el The ui host element
 */
export function unmount(el: Element) {
  m.mount(el, null)
}

/**
 * Redraws the ui
 *
 * @remarks
 * When changing the ui description object qui callbacks (e.g. `onInput` or `onChange`)
 * the ui will redraw automatically.
 *
 * However if the ui description oject is changed from outside the qui callback
 * then this method must be called in order to update the visual state.
 */
export function redraw() {
  m.redraw()
}

export function builder(el: HTMLElement, build: (b: Builder) => void) {
  const b = new Builder()
  build(b)
  b.mount(el)
}

/**
 * Utilities
 */
export const utils = u
