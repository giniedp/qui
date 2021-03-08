import type { FactoryComponent, ClassComponent } from 'mithril'

/**
 * @public
 */
export type ComponentType<T = any> = FactoryComponent<T> | ClassComponent<T>

/**
 * Base model for a component with children
 *
 * @public
 */
export interface ComponentGroupModel<T extends ComponentModel = ComponentModel> extends ComponentModel {
  /**
   * Collection of child components
   */
  children?: T[]
}

/**
 * Base model for a component
 *
 * @public
 */
export interface ComponentModel {
  /**
   * The type name of the component
   */
  type: string
  /**
   * If true, the component will not be rendered
   *
   * @remarks
   * This is a convenience property that allows to hide a component
   * without removing it from the component data model.
   */
  hidden?: boolean | (() => boolean)
  /**
   * The label for this component when rendered as a control
   *
   * @remarks
   * This is only evaluated when rendered as a child of a panel component
   */
  label?: string
}

/**
 * Common component attributes
 *
 * @public
 */
export type ComponentAttrs<T extends ComponentModel> = {
  data: T
}

export type KeyMatchingType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

/**
 * Utility to convert a value type
 *
 * @public
 */
export type ValueCodec<Encoded, Decoded> = {
  decode: (value: Encoded) => Decoded
  encode: (value: Decoded) => Encoded
}

export type ValueSource<T, V> = {
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
  value?: V | unknown
  codec?: ValueCodec<unknown, V>
}

/**
 * @public
 */
export type ArrayOrSingleOf<T> = T | T[]
