/*
  This is an example of 2D rendering, simply
  using bitmap fonts in orthographic space.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

global.THREE = require('three')
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var createText = require('../')
var MSDFShader = require('../shaders/msdf')

require('./load')({
  font: 'fnt/Roboto-msdf.json',
  image: 'fnt/Roboto-msdf.png'
}, start)

function start (font, texture) {
  var app = createOrbitViewer({
    clearColor: 'rgb(80, 80, 80)',
    clearAlpha: 1.0,
    fov: 65,
    position: new THREE.Vector3()
  })

  app.camera = new THREE.OrthographicCamera()
  app.camera.left = 0
  app.camera.top = 0
  app.camera.near = -100
  app.camera.far = 100

  var geom = createText({
    text: 'This text is rendered with Multi-Channel Signed Distance Fields.\n\n' +
      'The quick brown fox jumps over the lazy dog.',
    font: font,
    align: 'left',
    width: 500,
    flipY: texture.flipY
  })

  var material = new THREE.RawShaderMaterial(MSDFShader({
    map: texture,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  }))

  var layout = geom.layout
  var text = new THREE.Mesh(geom, material)
  var padding = 40
  text.position.set(padding, -layout.descender + layout.height + padding, 0)

  var textAnchor = new THREE.Object3D()
  textAnchor.add(text)
  app.scene.add(textAnchor)

  var time = 0
  // update orthographic
  app.on('tick', function (dt) {
    time += dt / 1000
    var s = (Math.sin(time * 0.5) * 0.5 + 0.5) * 2.0 + 0.5
    textAnchor.scale.set(s, s, s)
    // update camera
    var width = app.engine.width
    var height = app.engine.height
    app.camera.right = width
    app.camera.bottom = height
    app.camera.updateProjectionMatrix()
  })
}
