import m from 'mithril'
import { ButtonDef } from './button'
import { ButtonGroupDef } from './button-group'
import { CheckboxDef } from './checkbox'
import { GroupDef } from './group'
import { NumberDef } from './number'
import { SelectDef } from './select'
import { TabDef, TabsDef } from './tabs'
import { TextDef } from './text'
import { getComponent } from './utils'

export interface Removable {
  remove?: () => void
}

export interface WithControlType {
  type: string
}

export interface TabsBuilder {
  addTab(label: string, builder: (b: Builder) => void): TabDef & Removable
}

export class Builder {
  private controls: any[] = []
  private el: HTMLElement

  public addButton(text: string, opts: Partial<ButtonDef> = {}) {
    return this.add<ButtonDef>({
      ...opts,
      type: 'button',
      text: text,
    })
  }

  public addButtonGroup(label: string, opts: Partial<ButtonGroupDef>, builder: (b: Builder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<ButtonGroupDef>({
      ...opts,
      type: 'button-group',
      label: label,
      children: sub.controls,
    })
  }

  public addGroup(label: string, builder: (b: Builder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<GroupDef>({
      type: 'group',
      label: label,
      children: sub.controls,
    })
  }

  public addTabs(builder: (b: TabsBuilder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<TabsDef>({
      type: 'tabs',
      children: sub.controls,
    })
  }

  public addTab(label: string, builder: (b: Builder) => void) {
    const sub = new Builder()
    builder(sub)
    return this.add<TabDef>({
      type: 'tab',
      label: label,
      children: sub.controls,
    })
  }

  public addCheckbox<O>(property: keyof O, target: O, opts: Partial<CheckboxDef>) {
    return this.add<CheckboxDef>({
      label: String(property),
      ...opts,
      type: 'checkbox',
      target: target,
      property: property,
    })
  }

  public addText<O>(property: keyof O, target: O, opts: Partial<TextDef> = {}) {
    return this.add<TextDef>({
      label: String(property),
      ...opts,
      type: 'text',
      target: target,
      property: property,
    })
  }

  public addNumber<O>(property: keyof O, target: O, opts: Partial<NumberDef> = {}) {
    return this.add<NumberDef>({
      label: String(property),
      ...opts,
      type: 'number',
      target: target,
      property: property,
    })
  }

  public addSlider<O>(property: keyof O, target: O, opts: Partial<NumberDef> = {}) {
    return this.add<NumberDef>({
      label: String(property),
      ...opts,
      type: 'slider',
      target: target,
      property: property,
    })
  }

  public addSelect<O>(property: keyof O, target: O, opts: Partial<SelectDef> = {}) {
    return this.add<SelectDef>({
      label: String(property),
      ...opts,
      type: 'select',
      target: target,
      property: property,
    })
  }

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

  public mount(el: HTMLElement) {
    this.el = el
    return m.mount(el, { view: () => m(getComponent('panel'), { isRoot: true, data: this.controls }) })
  }

  public unmount() {
    m.mount(this.el, null)
  }
}
