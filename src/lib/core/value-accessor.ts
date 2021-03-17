import type { ValueSource } from './types'
import { call } from './utils'

/**
 * Gets a value of a view model
 *
 * @public
 * @param model - The model of a component
 */
export function getValue<V>(model: ValueSource<any, V>): V {
  return decode(model, readValue(model)) as V
}

/**
 * Sets a value on a view model
 *
 * @public
 * @param model - The model of a component
 * @param value - The value for the component
 * @returns the encoded value as it was written to the model
 */
export function setValue<V>(model: ValueSource<any, V>, value: V): unknown {
  const encoded = encode(model, value)
  writeValue(model, encoded)
  return encoded
}

function readValue(model: ValueSource<any, any>) {
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
}

function writeValue<V>(model: ValueSource<any, V>, value: V): void {
  if ('target' in model && model.target && model.property != null) {
    model.target[model.property] = value
  } else if (isWriteable(model, 'value')) {
    model.value = value
  }
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
