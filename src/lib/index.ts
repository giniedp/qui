/**
 * Tweak UI is a lightweight js library for building input controls with data binding
 *
 * @remarks
 * The library provides a set of common ui components built with mithriljs. The main objective
 * is to allow a developer to rapidly scaffold input interfaces for manipulating javascript objects
 * at runtime.
 *
 * Similar projects are:
 * {@link https://github.com/dataarts/dat.gui | dat.GUI}
 * {@link https://github.com/automat/controlkit.js | controlkit}
 * {@link https://github.com/colejd/guify | guify}
 *
 * @packageDocumentation
 */

import './components'

export * from './builder'
export * from './color-formats'
export * from './components'
export * from './core'
export * from './mount'

declare const VERSION_STRING: string

/**
 * The version string
 *
 * @public
 */
export const VERSION = VERSION_STRING
