import m from 'mithril'
import { ButtonDef } from './button'
import { ButtonGroupDef } from './button-group'
import { CheckboxDef } from './checkbox'
import { ColorDef } from './color'
import { ColorPickerDef } from './color-picker'
import { GroupDef } from './group'
import { ImageDef } from './image'
import { NumberDef } from './number'
import { SelectDef } from './select'
import { TabDef, TabsDef } from './tabs'
import { TextDef } from './text'
import { getComponent } from './utils'

export interface Removable {
  remove?: () => void
}

export interface TabsBuilder {
  tab(label: string, builder: (b: Builder) => void): TabDef & Removable
}

export class Builder {
  private controls: any[] = []
  private el: HTMLElement

  /**
   * Adds a button control
   *
   * @param text The button text
   * @param opts Additional options for the control
   */
  public button(text: string, opts: Partial<ButtonDef> = {}) {
    return this.add<ButtonDef>({
      ...opts,
      type: 'button',
      text: text,
    })
  }

  /**
   * Adds a button group control
   *
   * @param label The group label
   * @param text The button text
   * @param opts Additional options for the control
   * @param builder The builder function for creating sub controls
   */
  public buttonGroup(label: string, opts: Partial<ButtonGroupDef>, builder: (b: Builder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<ButtonGroupDef>({
      ...opts,
      type: 'button-group',
      label: label,
      children: sub.controls,
    })
  }

  /**
   * Adds a button group control
   *
   * @param label The group label
   * @param builder The builder function for creating sub controls
   */
  public group(label: string, builder: (b: Builder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<GroupDef>({
      type: 'group',
      label: label,
      children: sub.controls,
    })
  }

  /**
   * Adds a tabs panel control
   *
   * @param builder The builder function for creating sub controls
   */
  public tabs(builder: (b: TabsBuilder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<TabsDef>({
      type: 'tabs',
      active: 0,
      children: sub.controls,
    })
  }

  /**
   * Adds a tab control
   *
   * @param label The tab label
   * @param builder The builder function for creating sub controls
   */
  public tab(label: string, builder: (b: Builder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<TabDef>({
      type: 'tab',
      label: label,
      children: sub.controls,
    })
  }

  /**
   * Adds a checkbox control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public checkbox<O>(property: keyof O, target: O, opts: Partial<CheckboxDef>) {
    return this.add<CheckboxDef>({
      label: String(property),
      ...opts,
      type: 'checkbox',
      target: target,
      property: property,
    })
  }

  /**
   * Adds a text control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public text<O>(property: keyof O, target: O, opts: Partial<TextDef> = {}) {
    return this.add<TextDef>({
      label: String(property),
      ...opts,
      type: 'text',
      target: target,
      property: property,
    })
  }

  /**
   * Adds a number control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public number<O>(property: keyof O, target: O, opts: Partial<NumberDef> = {}) {
    return this.add<NumberDef>({
      label: String(property),
      ...opts,
      type: 'number',
      target: target,
      property: property,
    })
  }

  /**
   * Adds a number slider control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public slider<O>(property: keyof O, target: O, opts: Partial<NumberDef> = {}) {
    return this.add<NumberDef>({
      label: String(property),
      ...opts,
      type: 'slider',
      target: target,
      property: property,
    })
  }

  /**
   * Adds a select control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public select<O>(property: keyof O, target: O, opts: Partial<SelectDef> = {}) {
    return this.add<SelectDef>({
      label: String(property),
      ...opts,
      type: 'select',
      target: target,
      property: property,
    })
  }

  /**
   * Adds a color control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public color<O>(property: keyof O, target: O, opts: Partial<ColorDef> = {}) {
    return this.add<ColorDef>({
      label: String(property),
      ...opts,
      type: 'color',
      target: target,
      property: property,
    })
  }

  /**
   * Adds a color picker control
   *
   * @param property The accessor property
   * @param target The target object holding the value
   * @param opts Additional options for the control
   */
  public colorPicker<O>(property: keyof O, target: O, opts: Partial<ColorPickerDef> = {}) {
    return this.add<ColorPickerDef>({
      label: String(property),
      ...opts,
      type: 'color-picker',
      target: target,
      property: property,
    })
  }

  /**
   * Adds an image control
   *
   * @param label The control label
   * @param opts Additional options for the control
   */
  public image(label: string, opts: Partial<ImageDef> = {}) {
    return this.add<ImageDef>({
      ...opts,
      type: 'image',
      label: label,
    })
  }

  /**
   * Adds a single control
   *
   * @param def The control definition
   */
  public add(def: ButtonDef & Removable): ButtonDef & Removable
  public add(def: ButtonGroupDef & Removable): ButtonGroupDef & Removable
  public add(def: GroupDef & Removable): GroupDef & Removable
  public add(def: TabsDef & Removable): TabsDef & Removable
  public add(def: TabDef & Removable): TabDef & Removable
  public add(def: CheckboxDef & Removable): CheckboxDef & Removable
  public add(def: TextDef & Removable): TextDef & Removable
  public add(def: NumberDef & Removable): NumberDef & Removable
  public add(def: SelectDef & Removable): SelectDef & Removable
  public add(def: ColorDef & Removable): ColorDef & Removable
  public add(def: ColorPickerDef & Removable): ColorPickerDef & Removable
  public add(def: ImageDef & Removable): ImageDef & Removable
  public add<T>(def: T & Removable): T & Removable
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
   * @param el The target DOM element
   */
  public mount(el: HTMLElement) {
    this.el = el
    return m.mount(el, { view: () => m(getComponent('panel'), { isRoot: true, data: this.controls }) })
  }

  /**
   * Unmounts all controls from the DOM element
   */
  public unmount() {
    m.mount(this.el, null)
  }
}
