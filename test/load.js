var loadFont = require('load-bmfont')
global.THREE = require('three')

// A utility to load a font, then a texture
module.exports = function (opt, cb) {
  loadFont(opt.font, function (err, font) {
    if (err) throw err
    const loader = new THREE.TextureLoader()
    loader.load(opt.image, function (tex) {
      cb(font, tex)
    })
  })
}
