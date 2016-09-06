# Signed Distance Field Rendering

You can use Signed Distance Fields (SDF) or Multi-Channel SDF for sharper edges on text scaling.

## Tools

You will need to use a separate tool to generate signed distance field images and BMFont files. Examples of such tools:

- [Hiero](https://github.com/libgdx/libgdx/wiki/Distance-field-fonts) (SDF)
- [msdfgen](https://github.com/Chlumsky/msdfgen) (MSDF)
- [msdfgen-bmfont](https://github.com/Jam3/msdf-bmfont) (MSDF)

## SDF Shader

###### See the [test-3d.js](https://github.com/Jam3/three-bmfont-text/blob/master/test/test-3d.js) for a full example.

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

There is also `shaders/basic` which acts like a typical `THREE.MeshBasicMaterial`, but using a raw shader. This is useful when you want a consistent interface for manipulating color/texture/etc.

## MSDF Shader

###### See the [test-msdf.js](https://github.com/Jam3/three-bmfont-text/blob/master/test/test-msdf.js) for a full example.

A more recent technique by Viktor Chlumský known as Multi-Channel Signed Distance Fields (MSDF) may produce sharper results than typical SDF.

<img src="http://i.imgur.com/rM4dSl2.png" width="75%" />

To generate MSDF atlases with the BMFont spec, there is an experimental/work-in-progress tool here:

https://github.com/Jam3/msdf-bmfont

Clone the repo and follow the instructions to generate an atlas from your own TTF file.

Or, if you are feeling more ambitious, you can use the underlying [msdfgen](https://github.com/Chlumsky/msdfgen) binary to build MSDF tiles from a TTF file. You will need to assemble the tiles into a texture atlas and generate a new [BMFont file](http://www.angelcode.com/products/bmfont/doc/file_format.html) to get it working with `three-bmfont-text`.

To use the files with `three-bmfont-text`, you can require the `msdf` shader much like the above SDF shader:

```js
var MSDFShader = require('three-bmfont-text/shaders/msdf')

var material = new THREE.RawShaderMaterial(MSDFShader({
  map: fontAtlas,
  side: THREE.DoubleSide,
  transparent: true,
  color: 'rgb(230, 230, 230)'
}))
```

The `test` folder also includes `Roboto-msdf.json` and `Roboto-msdf.png` for testing.

MSDF and its tooling is still new and immature, so please post any issues or suggestions you may have.