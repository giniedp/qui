import { h, mount } from './core'
import { ComponentModel, ComponentGroupModel } from './types'

import { ButtonGroupModel } from './button-group'
import { ButtonModel } from './button'
import { CheckboxModel } from './checkbox'
import { ColorModel } from './color'
import { ColorPickerModel } from './color-picker'
import { CustomModel } from './custom'
import { DirectionModel } from './direction'
import { GroupModel } from './group'
import { ImageModel } from './image'
import { NumberModel } from './number'
import { PadModel } from './pad'
import { PanelModel } from './panel'
import { SelectModel } from './select'
import { TabsModel } from './tabs'
import { TextModel } from './text'
import { VectorModel } from './vector'
import { AccordeonModel } from './accordeon'

/**
 *
 * @public
 */
export interface Removable {
  remove?: () => void
}

/**
 * Union type of all build in models
 * @public
 */
export type BuildInComponent =
  | ButtonGroupModel
  | ButtonModel
  | CheckboxModel
  | ColorModel
  | ColorPickerModel
  | CustomModel
  | DirectionModel
  | GroupModel
  | ImageModel
  | NumberModel
  | PadModel
  | PanelModel
  | SelectModel
  | TabsModel
  | TextModel
  | VectorModel

/**
 * @public
 */
export interface TabsBuilder {
  tab(label: string, builder: (b: Builder) => void): PanelModel & Removable
}

/**
 * @public
 */
export interface AccordeonBuilder {
  /**
   * Adds a control group
   *
   * @param title - The group label
   * @param builder - A callback allowing to build sub controls
   */
  group(title: string, builder: (b: Builder) => void ): GroupModel & Removable
  /**
   * Adds a control group
   *
   * @param title - The group label
   * @param opts - Additional control options
   * @param builder - A callback allowing to build sub controls
   */
  group(title: string, opts: Partial<GroupModel>, builder?: (b: Builder) => void): GroupModel & Removable
  group(title: string, builder: (b: Builder) => void): GroupModel & Removable
}

function override<T extends ComponentModel, E>(partial: T, overrides: E): T & E
function override<T extends ComponentModel>(partial: Partial<T>, overrides: T): T
function override<T extends ComponentModel>(
  partial: Partial<T>,
  overrides: T,
): T {
  Object.keys(overrides).forEach((key: string) => {
    partial[key as keyof T] = overrides[key as keyof T]
  })
  return partial as T
}

function buildGroup<T extends ComponentGroupModel>(...args: any[]): Partial<T> {
  let cb: (builder: Builder) => void
  let opts: Partial<T> = {}
  if (typeof arguments[0] === 'function') {
    cb = arguments[0]
  } else {
    opts = arguments[0] || opts
    if (typeof arguments[1] === 'function') {
      cb = arguments[1]
    }
  }
  if (cb) {
    const builder = new Builder()
    cb(builder)
    opts.children = builder.controls
  }
  return opts
}

/**
 *
 * @public
 */
export class Builder {
  private el: HTMLElement

  /**
   * Collection of created controls
   */
  public readonly controls: any[] = []

  /**
   * Adds a button group control
   *
   * @param label - The group label
   * @param opts - Additional options for the control
   * @param builder - A callback allowing to build sub controls
   */
  public buttonGroup(
    label: string,
    builder: (b: Builder) => void,
  ): ButtonGroupModel & Removable
  public buttonGroup(
    label: string,
    opts: Partial<ButtonGroupModel>,
    builder: (b: Builder) => void,
  ): ButtonGroupModel & Removable
  public buttonGroup(label: string): ButtonGroupModel & Removable {
    const opts = buildGroup<ButtonGroupModel>(arguments[1], arguments[2])
    return this.add<ButtonGroupModel>(
      override(opts, {
        type: 'button-group',
        label: label,
        children: opts.children,
      }),
    )
  }

  /**
   * Adds a group control
   *
   * @param label - The group label
   * @param builder - A callback allowing to build sub controls
   */
  public group(
    label: string,
    builder: (b: Builder) => void,
  ): GroupModel & Removable
  public group(
    label: string,
    opts: Partial<GroupModel>,
    builder?: (b: Builder) => void,
  ): GroupModel & Removable
  public group(label: string): GroupModel & Removable {
    const opts = buildGroup<GroupModel>(arguments[1], arguments[2])
    return this.add<GroupModel>(
      override(opts, {
        type: 'group',
        title: label,
        children: opts.children,
      }),
    )
  }

  /**
   * Adds a panel control
   *
   * @param label - The group label
   * @param builder - A callback allowing to build sub controls
   */
  public panel(
    label: string,
    builder: (b: Builder) => void,
  ): PanelModel & Removable
  public panel(
    label: string,
    opts: Partial<PanelModel>,
    builder?: (b: Builder) => void,
  ): PanelModel & Removable
  public panel(label: string): PanelModel & Removable {
    const opts = buildGroup<PanelModel>(arguments[1], arguments[2])
    return this.add<PanelModel>(
      override(opts, {
        type: 'panel',
        label: label,
        children: opts.children,
      }),
    )
  }

  /**
   * Adds a tabs panel control
   *
   * @param cb - A callback allowing to build sub controls
   */
  public tabs(cb: (b: TabsBuilder) => void) {
    const sub = new Builder()
    cb(sub)
    return this.add<TabsModel>({
      type: 'tabs',
      active: 0,
      children: sub.controls,
    })
  }

  /**
   * Adds an accordeon control
   *
   * @param cb - A callback allowing to build sub controls
   */
  public accordeon(
    builder: (b: AccordeonBuilder) => void,
  ): AccordeonModel & Removable
  /**
   * Adds an accordeon control
   *
   * @param opts - Additional options for the control
   * @param cb - A callback allowing to build sub controls
   */
  public accordeon(
    opts: Partial<AccordeonModel>,
    builder?: (b: AccordeonBuilder) => void,
  ): AccordeonModel & Removable
  public accordeon() {
    const opts = buildGroup<AccordeonModel>(arguments[0], arguments[1])
    return this.add<AccordeonModel>(
      override(opts, {
        type: 'accordeon',
        children: opts.children,
      }),
    )
  }

  /**
   * Adds a tab control
   *
   * @param label - The tab label
   * @param cb - A callback allowing to build sub controls
   */
  public tab(
    label: string,
    cb: (builder: Builder) => void,
  ): PanelModel & Removable
  public tab(
    label: string,
    opts: Partial<PanelModel>,
    cb?: (builder: Builder) => void,
  ): PanelModel & Removable
  public tab(label: string): PanelModel & Removable {
    const opts = buildGroup<PanelModel>(arguments[1], arguments[2])
    return this.add<PanelModel>(
      override(opts, {
        type: 'panel',
        label: label,
        children: opts.children,
      }),
    )
  }

  /**
   * Adds a button control
   *
   * @param text - The button text
   * @param opts - Additional options for the control
   */
  public button(text: string, opts: Partial<ButtonModel> = {}) {
    return this.add<ButtonModel>(
      override(opts, {
        type: 'button',
        text: text,
      }),
    )
  }

  /**
   * Adds a checkbox control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public checkbox<T>(
    target: T,
    property: keyof T,
    opts: Partial<CheckboxModel<T>> = {},
  ): CheckboxModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<CheckboxModel<T>>(
      override(opts, {
        type: 'checkbox',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a text control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public text<T>(target: T, property: keyof T, opts: Partial<TextModel<T>> = {}): TextModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<TextModel<T>>(
      override(opts, {
        type: 'text',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a number control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public number<T>(
    target: T,
    property: keyof T,
    opts: Partial<NumberModel<T>> = {},
  ): NumberModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<NumberModel<T>>(
      override(opts, {
        type: 'number',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a number slider control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public slider<T>(
    target: T,
    property: keyof T,
    opts: Partial<NumberModel<T>> = {},
  ): NumberModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<NumberModel<T>>(
      override(opts, {
        type: 'slider',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a select control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public select<T>(
    target: T,
    property: keyof T,
    opts: Partial<SelectModel<T>> = {},
  ): SelectModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<SelectModel<T>>(
      override(opts, {
        type: 'select',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a color control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public color<T>(
    target: T,
    property: keyof T,
    opts: Partial<ColorModel<T>> = {},
  ): ColorModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<ColorModel<T>>(
      override(opts, {
        type: 'color',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a color picker control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public colorPicker<T>(
    target: T,
    property: keyof T,
    opts: Partial<ColorPickerModel<T>> = {},
  ): ColorPickerModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<ColorPickerModel<T>>(
      override(opts, {
        type: 'color-picker',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds an image control
   *
   * @param label - The control label
   * @param opts - Additional options for the control
   */
  public image(label: string, opts: Partial<ImageModel> = {}) {
    return this.add<ImageModel>(
      override(opts, {
        type: 'image',
        label: label,
      }),
    )
  }

  /**
   * Adds a description text
   *
   * @param label - The control label
   * @param text - The text message
   * @param opts - Additional options for the control
   */
  public custom(label: string, text: string, opts: Partial<CustomModel> = {}) {
    return this.add<CustomModel>(
      override(opts, {
        type: 'custom',
        label: label,
        node: text,
      }),
    )
  }

  /**
   * Adds a 2D Pad control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public pad<T>(target: T, property: keyof T, opts: Partial<PadModel<T>> = {}): PadModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add(
      override(opts, {
        type: 'pad',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a Direction control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public direction<T>(target: T, property: keyof T, opts: Partial<DirectionModel<T>> = {}): DirectionModel<T> {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add(
      override(opts, {
        type: 'direction',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a build in control
   *
   * @param def - The control definition
   */
  public add<T extends BuildInComponent>(def: T): T & Removable
  /**
   * Adds a control
   *
   * @param def - The control definition
   */
  public add<T extends ComponentModel>(def: T): T & Removable
  /**
   * Adds a control
   *
   * @param def - The control definition
   */
  public add<T extends ComponentModel>(def: T): T & Removable {
    this.controls.push(
      override(def, {
        remove: () => {
          const i = this.controls.indexOf(def)
          if (i >= 0) {
            this.controls.splice(i, 1)
          }
        },
      }),
    )
    return def
  }

  /**
   * Mounts the controls of this builder to the given DOM element
   *
   * @param el - The target DOM element (or a selector)
   */
  public mount(el: HTMLElement | string) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    return mount(this.el, this.controls)
  }

  /**
   * Unmounts all controls from the DOM element
   */
  public unmount() {
    h.mount(this.el, null)
  }
}

/**
 * Creates a new ui builder and mounts the result to the given DOM element
 *
 * @public
 * @param el - The DOM element (or a selector) where ui should be mounted at
 * @param builder - A build callback allowing to add controls before the ui is mounted
 */
export function build(
  el: HTMLElement | string,
  builder?: (b: Builder) => void,
) {
  const b = new Builder()
  if (builder) {
    builder(b)
  }
  b.mount(el)
  return b
}
