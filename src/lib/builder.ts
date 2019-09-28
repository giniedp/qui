import { ButtonModel } from './button'
import { ButtonGroupModel } from './button-group'
import { CheckboxModel } from './checkbox'
import { ColorModel } from './color'
import { ColorPickerModel } from './color-picker'
import {
  ControlGroupViewModel,
  ControlViewModel,
  getComponent,
  h,
} from './core'
import { GroupModel } from './group'
import { ImageModel } from './image'
import { NumberModel } from './number'
import { SelectModel } from './select'
import { TabData, TabsModel } from './tabs'
import { TextModel } from './text'

/**
 *
 * @public
 */
export interface Removable {
  remove?: () => void
}

/**
 *
 * @public
 */
export interface TabsBuilder {
  tab(label: string, builder: (b: Builder) => void): TabData & Removable
}

function assign<T extends ControlViewModel>(
  partial: Partial<T>,
  extension: T,
): T {
  Object.keys(extension).forEach((key: keyof T) => {
    partial[key] = extension[key]
  })
  return partial as T
}

function buildGroup<T extends ControlGroupViewModel>(
  ...args: any[]
): Partial<T> {
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
      assign(opts, {
        type: 'button-group',
        label: label,
        children: opts.children,
      }),
    )
  }

  /**
   * Adds a button group control
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
      assign(opts, {
        type: 'group',
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
   * Adds a tab control
   *
   * @param label - The tab label
   * @param cb - A callback allowing to build sub controls
   */
  public tab(label: string, cb: (builder: Builder) => void): TabData & Removable
  public tab(
    label: string,
    opts: Partial<TabData>,
    cb?: (builder: Builder) => void,
  ): TabData & Removable
  public tab(label: string): TabData & Removable {
    const opts = buildGroup<TabData>(arguments[1], arguments[2])
    return this.add<TabData>(
      assign(opts, {
        type: 'tab',
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
      assign(opts, {
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
    opts: Partial<CheckboxModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<CheckboxModel>(
      assign(opts, {
        type: 'checkbox',
        target: target,
        property: property,
      }),
    )
  }

  /**
   * Adds a checkbutton control
   *
   * @param target - The target object holding the value
   * @param property - The accessor property
   * @param opts - Additional options for the control
   */
  public checkbutton<T>(
    target: T,
    property: keyof T,
    opts: Partial<CheckboxModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<CheckboxModel>(
      assign(opts, {
        type: 'checkbutton',
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
  public text<T>(target: T, property: keyof T, opts: Partial<TextModel> = {}) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<TextModel>(
      assign(opts, {
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
    opts: Partial<NumberModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<NumberModel>(
      assign(opts, {
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
    opts: Partial<NumberModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<NumberModel>(
      assign(opts, {
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
    opts: Partial<SelectModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<SelectModel>(
      assign(opts, {
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
    opts: Partial<ColorModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<ColorModel>(
      assign(opts, {
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
    opts: Partial<ColorPickerModel> = {},
  ) {
    if (opts.label === undefined) {
      opts.label = String(property)
    }
    return this.add<ColorPickerModel>(
      assign(opts, {
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
      assign(opts, {
        type: 'image',
        label: label,
      }),
    )
  }

  /**
   * Adds a button control
   *
   * @param def - The button control definition
   */
  public add(def: ButtonModel & Removable): ButtonModel & Removable
  /**
   * Adds a button group control
   *
   * @param def - The button group control definition
   */
  public add(def: ButtonGroupModel & Removable): ButtonGroupModel & Removable
  /**
   * Adds a group control
   *
   * @param def - The group control definition
   */
  public add(def: GroupModel & Removable): GroupModel & Removable
  /**
   * Adds a tabs control
   *
   * @param def - The tabs control definition
   */
  public add(def: TabsModel & Removable): TabsModel & Removable
  /**
   * Adds a tab control
   *
   * @param def - The tab control definition
   */
  public add(def: TabData & Removable): TabData & Removable
  /**
   * Adds a checkbox control
   *
   * @param def - The checkbox control definition
   */
  public add(def: CheckboxModel & Removable): CheckboxModel & Removable
  /**
   * Adds a text control
   *
   * @param def - The text control definition
   */
  public add(def: TextModel & Removable): TextModel & Removable
  /**
   * Adds a number control
   *
   * @param def - The number control definition
   */
  public add(def: NumberModel & Removable): NumberModel & Removable
  /**
   * Adds a select control
   *
   * @param def - The select control definition
   */
  public add(def: SelectModel & Removable): SelectModel & Removable
  /**
   * Adds a color control
   *
   * @param def - The color control definition
   */
  public add(def: ColorModel & Removable): ColorModel & Removable
  /**
   * Adds a color picker control
   *
   * @param def - The color picker control definition
   */
  public add(def: ColorPickerModel & Removable): ColorPickerModel & Removable
  /**
   * Adds an image control
   *
   * @param def - The image control definition
   */
  public add(def: ImageModel & Removable): ImageModel & Removable
  /**
   * Adds a control
   *
   * @param def - The control definition
   */
  public add<T>(def: T & Removable): T & Removable
  /**
   * Adds a control
   *
   * @param def - The control definition
   */
  public add<C>(def: C & Removable): C & Removable {
    def.remove = () => {
      const i = this.controls.indexOf(def)
      if (i >= 0) {
        this.controls.splice(i, 1)
      }
    }
    this.controls.push(def)
    return def
  }

  /**
   * Mounts the controls of this builder to the given DOM element
   *
   * @param el - The target DOM element (or a selector)
   */
  public mount(el: HTMLElement | string) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    return h.mount(this.el, {
      view: () =>
        h(getComponent('panel'), { isRoot: true, data: this.controls }),
    })
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
