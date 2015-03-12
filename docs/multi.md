# Multipage Fonts

See the [test-multi.js](https://github.com/Jam3/three-bmfont-text/blob/master/test/test-multi.js) for a full example.

You need to specify `multipage: true` at creation time:

```js
var geom = createText({
  multipage: true,
  text: 'foobar'
})
```

You also need to make sure your BMFont tool is exporting the `pages` field correctly.

## Shader

This module exports `shaders/multipage` for convenience. Options:

- `textures` an array of textures parallel to the `pages` specified in your BMFont file(s) 
- `opacity` the opacity, default 1.0
- `color` the color to tint the text, default 0xffffff

This will generate a new shader with N number of texture samplers. Some devices may not support 8 or more active textures. 

```js
var Shader = require('three-bmfont-text/shaders/multipage')

var material = new THREE.ShaderMaterial(Shader({
  textures: fontAtlasPages,
  opacity: 0.25,
  color: 0xff0000
}))
```