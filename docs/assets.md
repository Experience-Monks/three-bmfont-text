# assets

## BMFont Generation

See [text-modules](https://github.com/mattdesl/text-modules) and [the LibGDX wiki](https://github.com/libgdx/libgdx/wiki/Hiero) for a list of different BMFont generation tools.

## JSON Object

This module operates on JSON descriptions of BMFont files that look like this:

```js
{
     pages: [
         "sheet_0.png", 
         "sheet_1.png"
     ],
     chars: [
         { chnl, height, id, page, width, x, y, xoffset, yoffset, xadvance },
         ...
     ],
     info: { ... },
     common: { ... },
     kernings: [
         { first, second, amount }
     ]
}
```

See [here](https://github.com/Jam3/load-bmfont/blob/master/json-spec.md) for the full spec. 

## converter

You can convert from/to various BMFont formats to the above JSON with [convert-bmfont](https://www.npmjs.com/package/convert-bmfont).

```sh
npm install convert-bmfont -g
```

For example:

```sh
#convert to JSON
convert-bmfont Arial.fnt > Arial.json

#convert to binary
convert-bmfont Arial.fnt -f bin > Arial.bin
```

## parsers

Or you can parse various font formats on the fly in Node and the browser.

- [parse-bmfont-ascii](https://www.npmjs.com/package/parse-bmfont-ascii) (text)
- [parse-bmfont-xml](https://www.npmjs.com/package/parse-bmfont-xml)
- [parse-bmfont-binary](https://www.npmjs.com/package/parse-bmfont-binary)

## loaders

For convenience, the [load-bmfont](https://www.npmjs.com/package/load-bmfont) module wraps the above parsers for Node/Browser and provides fallbacks for XHR1.0 browsers.

```js
var load = require('load-bmfont')
 
load('fonts/Arial-32.fnt', function(err, font) {
  if (err)
    throw err
  
  //The BMFont spec in JSON form 
  console.log(font.common.lineHeight)
  console.log(font.info)
  console.log(font.chars)
  console.log(font.kernings)
})
```

## packed binary

For further optimization, you can pack a number of font styles/sizes into a single binary file, and then decode that at runtime. 

- [pack-bmfonts](https://www.npmjs.com/package/pack-bmfonts)
- [unpack-bmfonts](https://www.npmjs.com/package/unpack-bmfonts)

For example:

```sh
pack-bmfonts fonts/*.{xml,fnt} > fonts/all.bin
```

Then, a XHR2.0 implementation for unpacking in a browser (with Browserify) might look like this:

```js
var xhr = require('xhr')
var unpack = require('unpack-bmfonts')

xhr({
  url: 'fonts/all.bin',
  responseType: 'arraybuffer'
}, function(err, res, arrayBuf) {
  if (err) 
    throw err

  var array = new Uint8Array(arrayBuf)
  var buffer = new Buffer(array)
  var fonts = unpack(buffer)
    
  //do something with your font array...
  console.log(fonts)
  console.log(fonts[0].common.lineHeight)
})
```