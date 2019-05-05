<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md) &gt; [ColorModel](./tweak-ui.colormodel.md)

## ColorModel interface

Describes a color control

<b>Signature:</b>

```typescript
export interface ColorModel<T = any, V = number | string | number[]> extends ControlViewModel, ValueSource<T, V> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [format](./tweak-ui.colormodel.format.md) | <code>string</code> | The format of the string value. Defaults to 'rgb' |
|  [normalized](./tweak-ui.colormodel.normalized.md) | <code>boolean</code> | Whether each component is normalized to range \[0:1\] |
|  [onChange](./tweak-ui.colormodel.onchange.md) | <code>(model: ColorModel&lt;T, V&gt;, value: V) =&gt; void</code> | This is called once the control value is committed by the user. |
|  [onInput](./tweak-ui.colormodel.oninput.md) | <code>(model: ColorModel&lt;T, V&gt;, value: V) =&gt; void</code> | This is called when the control value has been changed. |
|  [type](./tweak-ui.colormodel.type.md) | <code>'color'</code> | The type name of the control |
|  [value](./tweak-ui.colormodel.value.md) | <code>V</code> | The color value as a string. |
