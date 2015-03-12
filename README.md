# three-bmfont-text

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

[![screenshot](http://i.imgur.com/fJEeuPs.png)](https://jam3.github.io/three-bmfont-text/test)

[(click for demo)](https://jam3.github.io/three-bmfont-text/test) - [(source)](test/test-3d.js)

Bitmap font rendering for ThreeJS, batching glyphs into a single BufferGeometry. Supports word-wrapping, letter spacing, kerning, signed distance fields, multi-texture fonts, and more. About 8kb after minification.

Below is an example that uses [load-bmfont](https://www.npmjs.com/package/load-bmfont) to parse BMFont files on the fly with XHR:

```js
var createGeometry = require('three-bmfont-text')
var loadFont = require('load-bmfont')

loadFont('fonts/Arial.fnt', function(err, font) {
  //create a geometry of packed bitmap glyphs, 
  //word wrapped to 300px and right-aligned
  var geometry = createGeometry({
    text: 'Lorem ipsum\nDolor sit amet.',
    width: 300,
    align: 'right',
    font: font
  })
  
  //the resulting layout has metrics and bounds
  console.log(geometry.layout.height)
  console.log(geometry.layout.descender)
    
  //the texture atlas containing our glyphs
  var texture = THREE.ImageUtils.loadTexture('fonts/Arial.png')

  //We can use plain old bitmap materials
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 0xaaffff
  })

  //now do something with our text mesh ! 
  var mesh = new THREE.Mesh(geometry, material)
})
```

The glyph layout is built on [layout-bmfont-text](https://github.com/Jam3/layout-bmfont-text).

## Usage

[![NPM](https://nodei.co/npm/three-bmfont-text.png)](https://www.npmjs.com/package/three-bmfont-text)

#### `geometry = createText(opt)`

Returns a new BufferGeometry with the given options. The ThreeJS-specific options:

- `flipY` (boolean) whether the texture will be Y-flipped (default true)
- `multipage` (boolean) whether to construct this geometry with an extra buffer containing page IDs. This is necessary for multi-texture fonts (default false)

The rest of the options are passed to [layout-bmfont-text](https://github.com/Jam3/layout-bmfont-text):

- `font` (required) the BMFont definition which holds chars, kernings, etc
- `text` (string) the text to layout. Newline characters (`\n`) will cause line breaks
- `width` (number, optional) the desired width of the text box, causes word-wrapping and clipping in `"pre"` mode. Leave as undefined to remove word-wrapping (default behaviour)
- `mode` (string) a mode for [word-wrapper](https://www.npmjs.com/package/word-wrapper); can be 'pre' (maintain spacing), or 'nowrap' (collapse whitespace but only break on newline characters), otherwise assumes normal word-wrap behaviour (collapse whitespace, break at width or newlines)
- `align` (string) can be `"left"`, `"center"` or `"right"` (default: left)
- `letterSpacing` (number) the letter spacing in pixels (default: 0)
- `lineHeight` (number) the line height in pixels (default to `font.common.lineHeight`)
- `tabSize` (number) the number of spaces to use in a single tab (default 4)
- `start` (number) the starting index into the text to layout (default 0)
- `end` (number) the ending index (exclusive) into the text to layout (default `text.length`)

#### `geometry.update(opt)`

Re-builds the geometry using the given options. All options are the same as in the constructor, except for `multipage` which must be specified during construction-time. 

This method will recompute the text layout and rebuild the WebGL buffers.

#### `geometry.layout`

This is an instance of [layout-bmfont-text](https://github.com/Jam3/layout-bmfont-text). This supports metrics for `descender`, `baseline`, `xHeight`, `width`, `height`, etc.

## Demos

To run/build the demos:

```sh
git clone https://github.com/Jam3/three-bmfont-text.git
cd three-bmfont-text
npm install
```

Then choose one of the demos to run:

```sh
npm run test-3d
npm run test-2d
npm run test-multi
```

Open up `localhost:9966` (it may take a few seconds for the initial bundle). Then when you save the corresponding JS file (in [test/](test/)) it should re-bundle and trigger a live-reload event on the browser.

To build the distribution demo:

```sh
npm run build
```

## Help

### Asset Handling

See [docs/assets.md](docs/assets.md)

### Signed Distance Field Rendering

See [docs/sdf.md](docs/sdf.md)

### Multi-Texture Rendering

See [docs/multi.md](docs/multi.md)

## License

MIT, see [LICENSE.md](http://github.com/Jam3/three-bmfont-text/blob/master/LICENSE.md) for details.
