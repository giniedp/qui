<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tweak-ui](./tweak-ui.md) &gt; [SphericalModel](./tweak-ui.sphericalmodel.md) &gt; [onChange](./tweak-ui.sphericalmodel.onchange.md)

## SphericalModel.onChange property

This is called once the control value is committed by the user.

<b>Signature:</b>

```typescript
onChange?: (model: SphericalModel<T>, value: SphericalValue, key?: string | number) => void;
```

## Remarks

Unlike the `onInput` callback, this is not necessarily called for each value change.
