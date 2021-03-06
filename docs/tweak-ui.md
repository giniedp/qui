<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md)

## tweak-ui package

Tweak UI is a lightweight js library for building input controls with data binding

## Remarks

The library provides a set of common ui components built with mithriljs. The main objective is to allow a developer to rapidly scaffold input interfaces for manipulating javascript objects at runtime.

Similar projects are: [dat.GUI](https://github.com/dataarts/dat.gui) [controlkit](https://github.com/automat/controlkit.js) [guify](https://github.com/colejd/guify)

## Classes

|  Class | Description |
|  --- | --- |
|  [Builder](./tweak-ui.builder.md) |  |

## Functions

|  Function | Description |
|  --- | --- |
|  [build(el, builder)](./tweak-ui.build.md) | Creates a new ui builder and mounts the result to the given DOM element |
|  [getColorFormatter(format)](./tweak-ui.getcolorformatter.md) | Gets a formatter implementation for the given format |
|  [getComponent(type)](./tweak-ui.getcomponent.md) | Gets a registered component for a given type name |
|  [getValue(model)](./tweak-ui.getValue.md) | Gets a value of a view model |
|  [hsv2rgb(hsv)](./tweak-ui.hsv2rgb.md) | Converts hsv to rgb |
|  [mount(el, data)](./tweak-ui.mount.md) | Mounts a ui to the given element |
|  [redraw()](./tweak-ui.redraw.md) | Redraws the ui |
|  [registerComponent(type, comp, override)](./tweak-ui.registercomponent.md) | Registers a component |
|  [renderComponent(attrs)](./tweak-ui.rendercomponent.md) | Renders a registered component |
|  [renderModel(model)](./tweak-ui.rendermodel.md) | Renders a registered component using the model |
|  [rgb2hsv(rgb)](./tweak-ui.rgb2hsv.md) | Converts rgb to hsv |
|  [setValue(model, value)](./tweak-ui.setValue.md) | Sets a value on a view model |
|  [TwuiComponent(type)](./tweak-ui.twuicomponent.md) |  |
|  [unmount(el)](./tweak-ui.unmount.md) | Unmounts the ui from given host element |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [AccordeonBuilder](./tweak-ui.accordeonbuilder.md) |  |
|  [AccordeonModel](./tweak-ui.accordeonmodel.md) | Accordeon component model |
|  [AngleModel](./tweak-ui.anglemodel.md) | Spherical component model |
|  [ButtonGroupModel](./tweak-ui.buttongroupmodel.md) | Button group component model |
|  [ButtonModel](./tweak-ui.buttonmodel.md) | Button component model |
|  [CheckboxModel](./tweak-ui.checkboxmodel.md) | Describes a checkbox control |
|  [ColorFormatter](./tweak-ui.colorformatter.md) | An implementation to parse and format specific color format |
|  [ColorModel](./tweak-ui.colormodel.md) | Color component model |
|  [ColorPickerModel](./tweak-ui.colorpickermodel.md) | Color picker component model |
|  [ComponentGroupModel](./tweak-ui.componentgroupmodel.md) | Base model for a component with children |
|  [ComponentModel](./tweak-ui.componentmodel.md) | Base model for a component |
|  [CustomModel](./tweak-ui.custommodel.md) | Custom component model |
|  [DirectionModel](./tweak-ui.directionmodel.md) | Direction component model |
|  [GroupModel](./tweak-ui.groupmodel.md) | Group component model |
|  [HSL](./tweak-ui.hsl.md) | Describes a HSL color value |
|  [HSLA](./tweak-ui.hsla.md) | Describes a HSL color value with alpha |
|  [HSV](./tweak-ui.hsv.md) | Describes a HSV color value |
|  [HSVA](./tweak-ui.hsva.md) | Describes a HSV color value with alpha |
|  [ImageModel](./tweak-ui.imagemodel.md) | Image component model |
|  [NumberModel](./tweak-ui.numbermodel.md) | Number component model |
|  [PadModel](./tweak-ui.padmodel.md) | Pad component model |
|  [PanelModel](./tweak-ui.panelmodel.md) | Panel component model |
|  [Removable](./tweak-ui.removable.md) |  |
|  [RGB](./tweak-ui.rgb.md) | Describes an RGB color value |
|  [RGBA](./tweak-ui.rgba.md) | Describes an RGB color value with alpha |
|  [SelectModel](./tweak-ui.selectmodel.md) | Select component model |
|  [SphericalModel](./tweak-ui.sphericalmodel.md) | Spherical component model |
|  [TabsBuilder](./tweak-ui.tabsbuilder.md) |  |
|  [TabsModel](./tweak-ui.tabsmodel.md) | Tabs component model |
|  [TextModel](./tweak-ui.textmodel.md) | Text component model |

## Variables

|  Variable | Description |
|  --- | --- |
|  [AngleComponent](./tweak-ui.anglecomponent.md) |  |
|  [CheckboxComponent](./tweak-ui.checkboxcomponent.md) |  |
|  [h](./tweak-ui.h.md) | Mithril's hyperscript function. |
|  [NumberComponent](./tweak-ui.numbercomponent.md) |  |
|  [SphericalComponent](./tweak-ui.sphericalcomponent.md) |  |
|  [VERSION](./tweak-ui.version.md) | The version string |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [AccordeonAtts](./tweak-ui.accordeonatts.md) | Accordeon component attribuets |
|  [AngleAttrs](./tweak-ui.angleattrs.md) | Spherical component attributes |
|  [ArrayOrSingleOf](./tweak-ui.arrayorsingleof.md) |  |
|  [BuildInComponent](./tweak-ui.buildincomponent.md) | Union type of all build in models |
|  [ButtonAttrs](./tweak-ui.buttonattrs.md) | Button component attribuets |
|  [ButtonGroupAttrs](./tweak-ui.buttongroupattrs.md) | Button group component attributes |
|  [CheckboxAttrs](./tweak-ui.checkboxattrs.md) | Checkbox component attrs |
|  [ColorAttrs](./tweak-ui.colorattrs.md) | Color component attributes |
|  [ColorPickerAttrs](./tweak-ui.colorpickerattrs.md) | Color picker component attributes |
|  [ComponentAttrs](./tweak-ui.componentattrs.md) | Common component attributes |
|  [ComponentType](./tweak-ui.componenttype.md) |  |
|  [CustomAttrs](./tweak-ui.customattrs.md) | Custom component attributes |
|  [DirectionAttrs](./tweak-ui.directionattrs.md) | Direction component attributes |
|  [GroupAttrs](./tweak-ui.groupattrs.md) | Group component attributes |
|  [ImageAttrs](./tweak-ui.imageattrs.md) | Image component attrs |
|  [KeyMatchingType](./tweak-ui.keymatchingtype.md) |  |
|  [NumberAttrs](./tweak-ui.numberattrs.md) | Number component attributes |
|  [PadAttrs](./tweak-ui.padattrs.md) | Pad component attributes |
|  [PanelAttrs](./tweak-ui.panelattrs.md) | Panel component attributes |
|  [SelectAttrs](./tweak-ui.selectattrs.md) | Select component attributes |
|  [SelectModelOptions](./tweak-ui.selectmodeloptions.md) | Select component select options |
|  [SelectOption](./tweak-ui.selectoption.md) |  |
|  [SelectOptionArray](./tweak-ui.selectoptionarray.md) |  |
|  [SelectOptionGroup](./tweak-ui.selectoptiongroup.md) |  |
|  [SelectOptionsObject](./tweak-ui.selectoptionsobject.md) |  |
|  [SphericalAttrs](./tweak-ui.sphericalattrs.md) | Spherical component attributes |
|  [SphericalValue](./tweak-ui.sphericalvalue.md) |  |
|  [TabsAtts](./tweak-ui.tabsatts.md) | Tabs component attributes |
|  [TextAttrs](./tweak-ui.textattrs.md) | Text component attributes |
|  [ValueCodec](./tweak-ui.valuecodec.md) | Utility to convert a value type |
|  [ValueSource](./tweak-ui.valuesource.md) |  |
|  [VectorAttrs](./tweak-ui.vectorattrs.md) | Vector component attributes |
|  [VectorModel](./tweak-ui.vectormodel.md) | Vector component model |
|  [VectorValue](./tweak-ui.vectorvalue.md) |  |

