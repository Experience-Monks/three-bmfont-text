var xtend = require('xtend')

module.exports = function(opt) {
  opt = opt||{}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1

  var textures = opt.textures || []
  textures = Array.isArray(textures) ? textures : [ textures ]

  var baseUniforms = {}
  textures.forEach(function(tex, i) {
    baseUniforms['texture' + i] = { 
      type: 't', 
      value: tex
    }
  })

  var samplers = textures.map(function(tex, i) {
    return 'uniform sampler2D texture'+i+';'
  }).join('\n')

  var body = textures.map(function(tex, i) {
    var cond = i===0 ? 'if' : 'else if'
    return [
      cond+" (vPage == "+i+".0) {",
        "sampleColor = texture2D(texture"+i+", vUv);",
      "}"
    ].join('\n')
  }).join('\n')

  return xtend({
    uniforms: xtend(baseUniforms, {
      opacity: { type: 'f', value: opacity },
      color: { type: 'c', value: new THREE.Color(opt.color) }
    }),
    attributes: {
      page: { type: 'f', value: 0 }
    },
    vertexShader: [
      "attribute float page;",
      "varying vec2 vUv;",
      "varying float vPage;",
      "void main() {",
        "vUv = uv;",
        "vPage = page;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xyz, 1.0 );",
      "}"
    ].join("\n"),
    fragmentShader: [   
      "uniform float opacity;",
      "uniform vec3 color;",
      samplers,
      "varying float vPage;",
      "varying vec2 vUv;",
      "void main() {",
        "vec4 sampleColor = vec4(0.0);",
        body,
        "gl_FragColor = sampleColor * vec4(color, opacity);",
      "}"
    ].join("\n"),
    defines: {
      "USE_MAP": ""
    }
  }, opt)
}