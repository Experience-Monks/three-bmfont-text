/*
  This is an example of 3D rendering with
  a custom shader, special per-line shader effects,
  and glslify.
 */

global.THREE = require('three')
var quote = require('sun-tzu-quotes')
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var createBackground = require('three-vignette-background')
var createText = require('../')
var glslify = require('glslify')

require('./load')({
  font: 'fnt/DejaVu-sdf.fnt',
  image: 'fnt/DejaVu-sdf.png'
}, start)

function start (font, texture) {
  var app = createOrbitViewer({
    clearColor: 'rgb(40, 40, 40)',
    clearAlpha: 1.0,
    fov: 55,
    position: new THREE.Vector3(1, 1, -2)
  })

  var bg = createBackground()
  app.scene.add(bg)

  var geom = createText({
    font: font,
    align: 'center',
    width: 500,
    flipY: texture.flipY
  })

  // geom.setAttribute('line', new Float32Array(lineData));

  var material = new THREE.RawShaderMaterial({
    vertexShader: glslify(__dirname + '/shaders/fx.vert'),
    fragmentShader: glslify(__dirname + '/shaders/fx.frag'),
    uniforms: {
      animate: { type: 'f', value: 1 },
      iGlobalTime: { type: 'f', value: 0 },
      map: { type: 't', value: texture },
      color: { type: 'c', value: new THREE.Color('#000') }
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false
  })

  var text = new THREE.Mesh(geom, material)

  // scale it down so it fits in our 3D units
  var textAnchor = new THREE.Object3D()
  textAnchor.scale.multiplyScalar(-0.005)
  textAnchor.add(text)
  app.scene.add(textAnchor)

  var duration = 3
  next()

  var time = 0
  app.on('tick', function (dt) {
    time += dt / 1000
    material.uniforms.iGlobalTime.value = time
    material.uniforms.animate.value = time / duration
    if (time > duration) {
      time = 0
      next()
    }

    var width = window.innerWidth
    var height = window.innerHeight
    bg.style({
      aspect: width / height,
      aspectCorrection: false,
      scale: 2.5,
      grainScale: 0
    })
  })

  function next () {
    // set new text string
    geom.update(quote())

    var lines = geom.visibleGlyphs.map(function (glyph) {
      return glyph.line
    })

    var lineCount = lines.reduce(function (a, b) {
      return Math.max(a, b)
    }, 0)

    // for each quad, let's give it a vertex attribute
    // with the line index
    var lineData = lines.map(function (line) {
      // map to 0..1 for attribute
      var t = lineCount <= 1 ? 1 : (line / (lineCount - 1))
      // quad - 4 verts
      return [ t, t, t, t ]
    }).reduce(function (a, b) {
      return a.concat(b)
    }, [])

    // update the "line" vertex attribute
    geom.setAttribute('line', new THREE.BufferAttribute(new Float32Array(lineData), 1));

    // center the text
    var layout = geom.layout
    text.position.x = -layout.width / 2
    text.position.y = layout.height / 2
  }
}
