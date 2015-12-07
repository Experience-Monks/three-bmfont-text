# Signed Distance Field Rendering

See the [test-3d.js](https://github.com/Jam3/three-bmfont-text/blob/master/test/test-3d.js) for a full example.

## Tools

To generate signed distance field fonts, you could use a tool like Hiero. See here for a full guide:  

https://github.com/libgdx/libgdx/wiki/Distance-field-fonts

## Shader

This module exports `shaders/sdf` for convenience. It uses standard derivatives extension for anti-aliasing if available, otherwise falls back to `gl_FragCoord.w`. 

Options:

- `opacity` the opacity, default 1.0
- `color` the color to tint the text, default 0xffffff
- `alphaTest` the alpha test value, defaults to 0.0001
- `precision` the fragment shader precision, default `'highp'`

*Note:* `RawShaderMaterial` is required in order to support a wide range of ThreeJS versions.

```js
var Shader = require('three-bmfont-text/shaders/sdf')

var material = new THREE.RawShaderMaterial(Shader({
  map: fontAtlas,
  side: THREE.DoubleSide,
  transparent: true,
  color: 'rgb(230, 230, 230)'
}))
```