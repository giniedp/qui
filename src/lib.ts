import m from 'mithril'
import { Builder } from './controls/builder'
import { ControlDef, getComponent } from './controls/utils'

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
 * @param data The ui definition object
 */
export function mount(el: Element, data: ControlDef[]) {
  return m.mount(el, { view: () => m(getComponent('panel'), { isRoot: true, data: data }) })
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

/**
 * Creates a new ui builder and mounts the result to the given DOM element
 *
 * @param el The DOM element where ui should be mounted at
 * @param build A build callback allowing to add controls before the ui is mounted
 */
export function builder(el: HTMLElement, build?: (b: Builder) => void) {
  const b = new Builder()
  if (build) {
    build(b)
  }
  b.mount(el)
  return b
}
