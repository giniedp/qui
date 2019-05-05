import { default as m, Vnode } from 'mithril'
import { controllCssClass } from './utils'

/**
 * Mithril's hyperscript function.
 *
 * @public
 * @remarks
 * Useful to create custom components
 */
export const h = m

/**
 * Common control properties
 * @public
 */
export interface ControlViewModel {
  [key: string]: any
  /**
   * The type name of the control
   */
  type: string
  /**
   * Some sort of an id for a control {@link https://mithril.js.org/keys.html}
   */
  key?: string
  /**
   * If resolves to `true` this control will not be rendered
   */
  hidden?: boolean | (() => boolean)
  /**
   * The label text for this control
   *
   * @remarks
   * If this is not set or empty most controls will still render
   * an empty label element. Set this to `null` or `false` to
   * completely get rid of a label element.
   */
  label?: string
}

/**
 * @public
 */
export interface ValueSource<T, V> {
  /**
   * The object which is holding a control value
   *
   * @remarks
   * Requires the `property` option to be set.
   */
  target?: T
  /**
   * The property name in `target` where the control value is stored
   *
   * @remarks
   * Requires the `target` option to be set.
   */
  property?: keyof T
  /**
   * If `target` and `property` are not set, then this is used as the control value
   */
  value?: V
}

/**
 *
 * @public
 * @param node
 * @param view
 */
export function renderControl<T extends ControlViewModel, S>(node: Vnode<{ data: T}, S>, view: (data: T, state: S) => any) {
  const data = node.attrs.data
  if (!data) {
    return null
  }
  const label = data.label
  const content = view ? view(data, node.state) : null
  return !data ? null : m('div', { key: data.key, class: controllCssClass(data.type) },
    label == null ? null : m('label', data.label),
    content == null ? null : m('section', content),
  )
}

/**
 * Gets a value of a view model
 *
 * @public
 * @param model The view model of a control
 */
export function getModelValue<T, V>(model: ValueSource<T, V>): V {
  if (model.target && model.property && model.property in model.target) {
    return model.target[model.property] as any
  }
  return model.value
}

/**
 * Sets a value on a view model
 *
 * @public
 * @param model The view model of a control
 */
export function setModelValue<T, V>(model: ValueSource<T, V>, value: V): V {
  if (model.target && model.property) {
    model.target[model.property] = value as any
  }
  model.value = value
  return value
}

const components: { [key: string]: m.FactoryComponent<any> | m.ClassComponent } = {}

/**
 * Gets a registered component for a given type name
 *
 * @public
 * @param type The component type
 */
export function getComponent(type: string) {
  if (components[type]) {
    return components[type]
  }
  throw new Error(`no component found for type: ${type}`)
}

/**
 * Registeres a component
 *
 * @public
 * @param name The component type name
 * @param comp The component
 * @param override Allows to override an already registered component
 */
export function registerComponent(name: string, comp: m.FactoryComponent<any> | m.ClassComponent, overrode: boolean = false) {
  if (components[name] && ! overrode) {
    console.warn(`a component named '${name}' is already registered`)
  } else {
    components[name] = comp
  }
}

/**
 * Mounts a ui to the given element
 *
 * @public
 * @param el The ui host element
 * @param data The ui definition object
 */
export function mount(el: Element, data: ControlViewModel[]) {
  const component = { view: () => m(getComponent('panel'), { isRoot: true, data: data }) }
  if (typeof el === 'string') {
    m.mount(document.querySelector(el), component)
  } else {
    m.mount(el, component)
  }
}

/**
 * Unmounts the ui from given host element
 *
 * @public
 * @param el The ui host element
 */
export function unmount(el: Element | string) {
  if (typeof el === 'string') {
    m.mount(document.querySelector(el), null)
  } else {
    m.mount(el, null)
  }
}

/**
 * Redraws the ui
 *
 * @public
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
