import m from 'mithril'
import * as u from './controls/utils'
export * from './controls'
export * from './lib'

declare const VERSION_STRING: string
/**
 * The current qui lib version
 */
export const VERSION = VERSION_STRING

/**
 * Mithril's hyperscript function.
 *
 * @remarks
 * Useful to create custom components
 */
export const h = m

/**
 * Utilities
 */
export const utils = u
