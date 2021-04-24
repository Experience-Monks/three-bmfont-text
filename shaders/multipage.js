var assign = require('object-assign')

module.exports = function createMultipageShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var precision = opt.precision || 'highp'
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001

  var textures = opt.textures || []
  textures = Array.isArray(textures) ? textures : [textures]

  var baseUniforms = {}
  textures.forEach((tex, i) => {
    baseUniforms[`texture${i}`] = {
      value: tex
    }
  })

  var samplers = textures
    .map((tex, i) => {
      return `uniform sampler2D texture${i};
      `
    })
    .join('')

  var body = textures
    .map((tex, i) => {
      var cond = i === 0 ? 'if' : 'else if'
      return `${cond} (vPage == ${i}.0) {
				  sampleColor = texture2D(texture${i}, vUv);
				}`
    })
    .join('')

  var color = opt.color

  // remove to satisfy r73
  delete opt.textures
  delete opt.color
  delete opt.precision
  delete opt.opacity

  const webgl2 = document.getElementsByTagName('canvas')[0].getContext('webgl2')

  var attributes = {
    attributes: { page: { value: 0 } }
  }

  var threeVers = (parseInt(THREE.REVISION, 10) || 0) | 0
  if (threeVers >= 72) {
    attributes = undefined
  }

  return assign(
    {
      uniforms: assign({}, baseUniforms, {
        opacity: { value: opacity },
        color: { value: new THREE.Color(color) }
      }),
      vertexShader: `${
				webgl2
					? `#version 300 es

#define attribute in
#define varying out`
					: ''
			}
attribute vec3 position;
attribute vec2 uv;
attribute float page;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;
varying float vPage;

void main() {
  vUv = uv;
  vPage = page;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
      fragmentShader: `${
				webgl2
					? `#version 300 es
#define varying in
out highp vec4 pc_fragColor;

#define texture2D texture
#define gl_FragColor pc_fragColor`
					: ''
			}
precision ${precision} float;
uniform float opacity;
uniform vec3 color;

${samplers}

varying float vPage;
varying vec2 vUv;

void main() {
  vec4 sampleColor = vec4(0.0);
  ${body}
  gl_FragColor = sampleColor * vec4(color, opacity);
  ${alphaTest === 0 ? '' : `if (gl_FragColor.a < ${alphaTest}) discard;`}
}`
    },
    attributes,
    opt
  )
}
