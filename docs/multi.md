# Multipage Fonts

See the [test-multi.js](https://github.com/Jam3/three-bmfont-text/blob/master/test/test-multi.js) for a full example.

Specify a `multipage` option when updating your text geometry.

```js
var geom = createText({ multipage: true, ... })
geom.update('foobar')
```

You also need to make sure your BMFont tool is exporting the `pages` field correctly.

## Shader

This module exports `shaders/multipage` for convenience. Options:

- `textures` an array of textures parallel to the `pages` specified in your BMFont file(s) 
- `opacity` the opacity, default 1.0
- `color` the color to tint the text, default 0xffffff
- `alphaTest` the alpha test value, defaults to 0.0001
- `precision` the fragment shader precision, default `'highp'`

This will generate a new shader with N number of texture samplers. Some devices may not support 8 or more active textures. 

*Note:* `RawShaderMaterial` is required in order to support a wide range of ThreeJS versions.

```js
var Shader = require('three-bmfont-text/shaders/multipage')

var material = new THREE.RawShaderMaterial(Shader({
  textures: fontAtlasPages,
  opacity: 0.25,
  color: 0xff0000
}))
```