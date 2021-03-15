
// tslint:disable: unified-signatures

import { ComponentModel, ComponentGroupModel, ValueSource } from './core'

import {
  AccordeonModel,
  AngleModel,
  ButtonModel,
  CheckboxModel,
  ContainerModel,
  ColorModel,
  ColorPickerModel,
  ContentModel,
  GroupModel,
  ImageModel,
  NumberModel,
  PointModel,
  SelectModel,
  SphericalModel,
  TabsModel,
  TextModel,
  PositionModel,
} from './components'
import { isFunction, isObject, isString } from './core/utils'
import { Child } from 'mithril'

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
 | AccordeonModel
 | AngleModel
 | ButtonModel
 | CheckboxModel
 | ColorModel
 | ColorPickerModel
 | ContainerModel
 | ContentModel
 | GroupModel
 | ImageModel
 | NumberModel
 | PointModel
 | SelectModel
 | SphericalModel
 | TabsModel
 | TextModel
 | PositionModel

/**
 * @public
 */
export type BuilderFn = (b: Builder) => void

/**
 * @public
 */
export type TabsBuilderFn = (b: TabsBuilder) => void

/**
 * @public
 */
export type AccordeonBuilderFn = (b: AccordeonBuilder) => void

/**
 * @public
 */
export interface TabsBuilder {
  group(label: string, builder: BuilderFn): GroupModel & Removable
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
  group(title: string, builder: BuilderFn): GroupModel & Removable
  /**
   * Adds a control group
   *
   * @param title - The group label
   * @param opts - Additional control options
   * @param builder - A callback allowing to build sub controls
   */
  group(title: string, opts: Partial<GroupModel>, builder?: BuilderFn): GroupModel & Removable
  group(title: string, builder: BuilderFn): GroupModel & Removable
}

function assign<T extends ComponentModel, E>(partial: T, overrides: E): T & E
function assign<T extends ComponentModel>(partial: Partial<T>, overrides: T): T
function assign<T extends ComponentModel>(partial: Partial<T>, overrides: T): T {
  Object.keys(overrides).forEach((key: string) => {
    partial[key as keyof T] = overrides[key as keyof T]
  })
  return partial as T
}

function buildGroup<T extends ComponentGroupModel>(this: Builder): Partial<T> {
  let label: string = null
  let opts: Partial<T> = {}
  let cb: BuilderFn

  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (isString(arg)) {
      label = arg
    } else if (isObject(arg)) {
      opts = arg
    } else if (isFunction(arg)) {
      cb = arg
    }
  }

  if (label) {
    opts.label = label
  }

  if (cb) {
    const controls = this.controls
    this.controls = []
    cb(this)
    opts.children = this.controls
    this.controls = controls
  }
  return opts
}


function buildControl<T extends ValueSource<any, any> & ComponentModel>(): Partial<T> {
  let opts: Partial<T> = {}

  if (arguments.length > 1) {
    opts = arguments[2] || opts
    opts.target = arguments[0]
    opts.property = arguments[1]
    if (opts.label === undefined) {
      opts.label = String(opts.property || '')
    }
  }
  if (arguments.length === 1) {
    opts = arguments[0] || opts
  }

  return opts
}

/**
 *
 * @public
 */
export class Builder {
  /**
   * Collection of created controls
   */
  public controls: ComponentModel[] = []

  public group(builder: BuilderFn): GroupModel & Removable
  public group(opts: Partial<GroupModel>): GroupModel & Removable
  public group(opts: Partial<GroupModel>, builder: BuilderFn): GroupModel & Removable
  public group(label: string, builder: BuilderFn): GroupModel & Removable
  public group(label: string, opts: Partial<GroupModel>): GroupModel & Removable
  public group(label: string, opts: Partial<GroupModel>, builder: BuilderFn): GroupModel & Removable
  public group(): GroupModel & Removable {
    const opts: Partial<GroupModel> = buildGroup.apply(this, arguments)
    return this.add<GroupModel>(assign(opts, {
      type: 'group',
      children: opts.children,
      label: null,
      title: opts.label,
    }))
  }

  public collapsible(builder: BuilderFn): GroupModel & Removable
  public collapsible(opts: Partial<GroupModel>): GroupModel & Removable
  public collapsible(opts: Partial<GroupModel>, builder: BuilderFn): GroupModel & Removable
  public collapsible(label: string, builder: BuilderFn): GroupModel & Removable
  public collapsible(label: string, opts: Partial<GroupModel>): GroupModel & Removable
  public collapsible(label: string, opts: Partial<GroupModel>, builder: BuilderFn): GroupModel & Removable
  public collapsible(): GroupModel & Removable {
    const opts: Partial<GroupModel> = buildGroup.apply(this, arguments)
    return this.add<GroupModel>(assign(opts, {
      type: 'group',
      children: opts.children,
      collapsible: true,
      label: null,
      title: opts.label,
    }))
  }

  public container(builder: BuilderFn): ContainerModel & Removable
  public container(opts: Partial<ContainerModel>): ContainerModel & Removable
  public container(opts: Partial<ContainerModel>, builder: BuilderFn): ContainerModel & Removable
  public container(label: string, builder: BuilderFn): ContainerModel & Removable
  public container(label: string, opts: Partial<ContainerModel>): ContainerModel & Removable
  public container(label: string, opts: Partial<ContainerModel>, builder: BuilderFn): ContainerModel & Removable
  public container(): ContainerModel & Removable {
    const opts: Partial<ContainerModel> = buildGroup.apply(this, arguments)
    return this.add<ContainerModel>(assign(opts, {
      type: 'container',
      children: opts.children,
    }))
  }

  public tabs(builder: TabsBuilderFn): TabsModel & Removable
  public tabs(opts: Partial<TabsModel>): TabsModel & Removable
  public tabs(opts: Partial<TabsModel>, builder: TabsBuilderFn): TabsModel & Removable
  public tabs(label: string, builder: TabsBuilderFn): TabsModel & Removable
  public tabs(label: string, opts: Partial<TabsModel>): TabsModel & Removable
  public tabs(label: string, opts: Partial<TabsModel>, builder: TabsBuilderFn): TabsModel & Removable
  public tabs(): TabsModel & Removable {
    const opts: Partial<TabsModel> = buildGroup.apply(this, arguments)
    return this.add<TabsModel>(assign(opts, {
      type: 'tabs',
      active: opts.active || 0,
      children: opts.children,
    }))
  }

  public accordion(builder: AccordeonBuilderFn): AccordeonModel & Removable
  public accordion(opts: Partial<AccordeonModel>): AccordeonModel & Removable
  public accordion(opts: Partial<AccordeonModel>, builder: AccordeonBuilderFn): AccordeonModel & Removable
  public accordion(label: string, builder: AccordeonBuilderFn): AccordeonModel & Removable
  public accordion(label: string, opts: Partial<AccordeonModel>): AccordeonModel & Removable
  public accordion(label: string, opts: Partial<AccordeonModel>, builder: AccordeonBuilderFn): AccordeonModel & Removable
  public accordion(): AccordeonModel & Removable {
    const opts: Partial<AccordeonModel> = buildGroup.apply(this, arguments)
    return this.add<AccordeonModel>(assign(opts, {
      type: 'accordion',
      children: opts.children,
    }))
  }

  public checkbox(opts: Partial<CheckboxModel>): CheckboxModel
  public checkbox<T>(target: T, property: keyof T): CheckboxModel<T>
  public checkbox<T>(target: T, property: keyof T, opts: Partial<CheckboxModel<T>>): CheckboxModel<T>
  public checkbox(): CheckboxModel {
    const opts: Partial<CheckboxModel> = buildControl.apply(this, arguments)
    return this.add<CheckboxModel>(
      assign(opts, { type: 'checkbox' }),
    )
  }

  public text(opts: Partial<TextModel>): TextModel
  public text<T>(target: T, property: keyof T): TextModel<T>
  public text<T>(target: T, property: keyof T, opts: Partial<TextModel<T>>): TextModel<T>
  public text(): TextModel {
    const opts: Partial<TextModel> = buildControl.apply(this, arguments)
    return this.add<TextModel>(
      assign(opts, { type: 'text' }),
    )
  }

  public number(opts: Partial<NumberModel>): NumberModel
  public number<T>(target: T, property: keyof T): NumberModel<T>
  public number<T>(target: T, property: keyof T, opts: Partial<NumberModel<T>>): NumberModel<T>
  public number(): NumberModel {
    const opts: Partial<NumberModel> = buildControl.apply(this, arguments)
    return this.add<NumberModel>(
      assign(opts, { type: 'number' }),
    )
  }

  public slider(opts: Partial<NumberModel>): NumberModel
  public slider<T>(target: T, property: keyof T): NumberModel<T>
  public slider<T>(target: T, property: keyof T, opts: Partial<NumberModel<T>>): NumberModel<T>
  public slider(): NumberModel {
    const opts: Partial<NumberModel> = buildControl.apply(this, arguments)
    return this.add<NumberModel>(
      assign(opts, { type: 'slider' }),
    )
  }

  public position(opts: Partial<PositionModel>): PositionModel
  public position<T>(target: T, property: keyof T): PositionModel<T>
  public position<T>(target: T, property: keyof T, opts: Partial<PositionModel<T>>): PositionModel<T>
  public position(): PositionModel {
    const opts: Partial<PositionModel> = buildControl.apply(this, arguments)
    return this.add<PositionModel>(
      assign(opts, { type: 'position' }),
    )
  }
  public select(opts: Partial<SelectModel>): SelectModel
  public select<T>(target: T, property: keyof T): SelectModel<T>
  public select<T>(target: T, property: keyof T, opts: Partial<SelectModel<T>>): SelectModel<T>
  public select(): SelectModel {
    const opts: Partial<SelectModel> = buildControl.apply(this, arguments)
    return this.add<SelectModel>(
      assign(opts, { type: 'select' }),
    )
  }

  public color(opts: Partial<ColorModel>): ColorModel
  public color<T>(target: T, property: keyof T): ColorModel<T>
  public color<T>(target: T, property: keyof T, opts: Partial<ColorModel<T>>): ColorModel<T>
  public color(): ColorModel {
    const opts: Partial<ColorModel> = buildControl.apply(this, arguments)
    return this.add<ColorModel>(
      assign(opts, { type: 'color' }),
    )
  }

  public colorPicker(opts: Partial<ColorPickerModel>): ColorPickerModel
  public colorPicker<T>(target: T, property: keyof T): ColorPickerModel<T>
  public colorPicker<T>(target: T, property: keyof T, opts: Partial<ColorPickerModel<T>>): ColorPickerModel<T>
  public colorPicker(): ColorPickerModel {
    const opts: Partial<ColorPickerModel> = buildControl.apply(this, arguments)
    return this.add<ColorPickerModel>(
      assign(opts, { type: 'color-picker' }),
    )
  }

  public point(opts: Partial<PointModel>): PointModel
  public point<T>(target: T, property: keyof T): PointModel<T>
  public point<T>(target: T, property: keyof T, opts: Partial<PointModel<T>>): PointModel<T>
  public point(): PointModel {
    const opts: Partial<PointModel> = buildControl.apply(this, arguments)
    return this.add<PointModel>(
      assign(opts, { type: 'point' }),
    )
  }

  public spherical(opts: Partial<SphericalModel>): SphericalModel
  public spherical<T>(target: T, property: keyof T): SphericalModel<T>
  public spherical<T>(target: T, property: keyof T, opts: Partial<SphericalModel<T>>): SphericalModel<T>
  public spherical(): SphericalModel {
    const opts: Partial<SphericalModel> = buildControl.apply(this, arguments)
    return this.add<SphericalModel>(
      assign(opts, { type: 'spherical' }),
    )
  }

  public angle(opts: Partial<AngleModel>): AngleModel
  public angle<T>(target: T, property: keyof T): AngleModel<T>
  public angle<T>(target: T, property: keyof T, opts: Partial<AngleModel<T>>): AngleModel<T>
  public angle(): AngleModel {
    const opts: Partial<AngleModel> = buildControl.apply(this, arguments)
    return this.add<AngleModel>(
      assign(opts, { type: 'angle' }),
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
   * Adds an image control
   *
   * @param label - The control label
   * @param opts - Additional options for the control
   */
  public image(opts: Partial<ImageModel>): ImageModel & Removable
  public image(label: string, opts: Partial<ImageModel>): ImageModel & Removable
  public image() {
    const opts: Partial<ImageModel> = buildGroup.apply(this, arguments)
    return this.add<ImageModel>(assign(opts, {
      type: 'image',
    }))
  }

  /**
   * Adds a description text
   *
   * @param label - The control label
   * @param text - The text message
   * @param opts - Additional options for the control
   */
  public content(label: string, content: Child, opts: Partial<ContentModel> = {}) {
    return this.add<ContentModel>(
      assign(opts, {
        type: 'content',
        label: label,
        content: content,
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
      assign(def, {
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
}
