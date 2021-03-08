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

import './angle'
import './accordeon'
import './button-group'
import './button'
import './checkbox'
import './color-picker'
import './color'
import './custom'
import './direction'
import './group'
import './image'
import './number'
import './pad'
import './panel'
import './select'
import './spherical'
import './tabs'
import './text'
import './vector'

export * from './core'
export * from './color-formats'
export * from './builder'
export * from './types'

export * from './angle'
export * from './accordeon'
export * from './button-group'
export * from './button'
export * from './checkbox'
export * from './color-picker'
export * from './color'
export * from './custom'
export * from './direction'
export * from './group'
export * from './image'
export * from './number'
export * from './pad'
export * from './panel'
export * from './select'
export * from './spherical'
export * from './tabs'
export * from './text'
export * from './vector'

declare const VERSION_STRING: string

/**
 * The version string
 *
 * @public
 */
export const VERSION = VERSION_STRING
