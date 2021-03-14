import type { ValueSource } from './types'

/**
 * Gets a value of a view model
 *
 * @public
 * @param model - The model of a component
 */
export function getValue<V>(model: ValueSource<any, V>): V {
  let result: unknown = null
  if (
    'target' in model &&
    model.target &&
    model.property != null &&
    model.property in model.target
  ) {
    result = model.target[model.property]
  } else if ('value' in model) {
    result = model.value
  }
  return decode(model, result) as V
}

/**
 * Sets a value on a view model
 *
 * @public
 * @param model - The model of a component
 * @param value - The value for the component
 * @returns result of {@link getValue} after the value has been set
 */
export function setValue<V>(model: ValueSource<any, V>, value: V): V {
  if ('target' in model && model.target && model.property != null) {
    model.target[model.property] = encode(model, value)
  } else if (isWriteable(model, 'value')) {
    model.value = encode(model, value)
  }
  return getValue(model)
}

function isWriteable<T>(obj: T, key: keyof T): boolean {
  const desc = Object.getOwnPropertyDescriptor(obj, key)
  return !desc || !!desc.writable || !!desc.set
}

function encode<V>(source: ValueSource<any, V>, value: V) {
  return 'codec' in source && source.codec ? source.codec.encode(value) : value
}
function decode<V>(source: ValueSource<any, V>, value: V) {
  return 'codec' in source && source.codec ? source.codec.decode(value) : value
}
