import { default as m } from 'mithril'
import { use } from './utils'
import type { PanelModel } from './panel'
import { ComponentModel, ComponentAttrs, ValueSource, ComponentType } from './types'

/**
 * Mithril's hyperscript function.
 *
 * @public
 * @remarks
 * Useful to create custom components
 */
export const h = m

/**
 * Renders a registered component
 *
 * @public
 * @param attrs - The component attributes
 * @param children - The component children
 */
export function renderComponent<T extends ComponentAttrs<ComponentModel>>(attrs: T) {
  return use(attrs.data, (data) => {
    if (!data.type) {
      console.error(new Error('Given data is missing the .type property. Component can resolve the component'), data)
      return null
    }
    if (!registry[data.type]) {
      console.error(new Error(`Component of type '${data.type}' is not registered. Can not render component`), data)
      return null
    }
    if (data.hidden) {
      return null
    }
    return m(getComponent(data.type), attrs)
  })
}

/**
 * Renders a registered component using the model
 *
 * @public
 * @param model - The model
 */
export function renderModel<T extends ComponentModel>(model: T) {
  return renderComponent({ data: model })
}

/**
 * Gets a value of a view model
 *
 * @public
 * @param model - The model of a component
 */
export function getModelValue<V>(model: ValueSource<any, V>): V {
  if (
    'target' in model &&
    model.target &&
    model.property != null &&
    model.property in model.target
  ) {
    return model.target[model.property]
  }
  if ('value' in model) {
    return model.value
  }
  return null
}

/**
 * Sets a value on a view model
 *
 * @public
 * @param model - The model of a component
 * @param value - The value for the component
 * @returns result of {@link getModelValue} after the value has been set
 */
export function setModelValue<V>(model: ValueSource<any, V>, value: V): V {
  if (
    'target' in model &&
    model.target &&
    model.property != null
  ) {
    model.target[model.property] = value
  }
  const desc = Object.getOwnPropertyDescriptor(model, 'value')
  if (!desc || desc.writable || desc.set) {
    model.value = value
  }
  return getModelValue(model)
}

const registry: {
  [key: string]: ComponentType<any>,
} = {}

/**
 * Gets a registered component for a given type name
 *
 * @public
 * @param type - The component type
 */
export function getComponent<T extends ComponentAttrs<any>>(type: string): ComponentType<T> {
  if (registry[type]) {
    return registry[type]
  }
  throw new Error(`Component of type '${type}' was not found`)
}

/**
 * Registers a component
 *
 * @public
 * @param type - The component type name
 * @param comp - The component
 * @param override - Allows to override an already registered component
 */
export function registerComponent<T>(
  type: string,
  comp: ComponentType<T>,
  override: boolean = false,
) {
  if (registry[type] && !override) {
    console.warn(`Component ignored. Name '${type}' is already registered.`)
  } else {
    registry[type] = comp
  }
}

/**
 * Mounts a ui to the given element
 *
 * @public
 * @param el - The ui host element
 * @param data - The ui definition object
 */
export function mount(el: Element | string, data: ComponentModel | ComponentModel[]) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  el.classList.add('twui-root')

  if (Array.isArray(data)) {
    m.mount(el, {
      view: () => renderModel<PanelModel>({
        type: 'panel',
        children: data,
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
