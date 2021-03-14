import type { ComponentAttrs, ComponentType } from './types'

const registry: {
  [key: string]: ComponentType<any>
} = {}

/**
 * Gets a registered component for a given type name
 *
 * @public
 * @param type - The component type
 */
export function getComponent<T extends ComponentAttrs<any>>(
  type: string,
): ComponentType<T> {
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
export function component<T>(
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
