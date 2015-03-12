# assets

## BMFont Tools

See [the LibGDX wiki](https://github.com/libgdx/libgdx/wiki/Hiero) for some tooling around BMFont files.

## bmfont2json

This module expects the provided fonts to be objects that look like this: 

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

See [here](https://github.com/mattdesl/bmfont2json/wiki/JsonSpec) for the full spec. 

If you want to convert XML/ASCII BMFont files to JSON offline, you can use the [bmfont2json](https://github.com/mattdesl/bmfont2json) command line tool.

```sh
bmfont2json Arial.fnt > Arial.json
```

## parsers

Parsers will be maintained independently. Browser XML parsing (without xml2js) and binary formats are planned.

- [parse-bmfont-ascii](https://www.npmjs.com/package/parse-bmfont-ascii) (text)
- [parse-bmfont-xml](https://www.npmjs.com/package/parse-bmfont-xml)

## loaders

For convenience, the [load-bmfont](https://www.npmjs.com/package/load-bmfont) module wraps the various formats for Node/Browser.

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