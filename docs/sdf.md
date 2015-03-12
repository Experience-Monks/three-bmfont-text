# Signed Distance Field Rendering

See the [test-3d.js](https://github.com/Jam3/three-bmfont-text/blob/master/test/test-3d.js) for a full example.

## Tools

To generate signed distance field fonts, you could use a tool like Hiero. See here for a full guide:  

https://github.com/libgdx/libgdx/wiki/Distance-field-fonts

## Shader

This module exports `shaders/sdf` for convenience. Options:

- `smooth` the smoothing value for the signed distance field, defaults to `1/16`
- `alphaTest` the alpha test value, defaults to 0.06
- `opacity` the opacity, default 1.0
- `color` the color to tint the text, default 0xffffff

```js
var Shader = require('three-bmfont-text/shaders/sdf')

var material = new THREE.ShaderMaterial(Shader({
  map: fontAtlas,
  smooth: 1/32,
  side: THREE.DoubleSide,
  transparent: true,
  color: 'rgb(230, 230, 230)'
}))
```