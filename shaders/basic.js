var assign = require('object-assign')

module.exports = function createBasicShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity

  const webgl2 = document.getElementsByTagName('canvas')[0].getContext('webgl2')

  return assign(
    {
      uniforms: {
        opacity: { value: opacity },
        map: { value: map || new THREE.Texture() },
        color: { value: new THREE.Color(color) }
      },
      vertexShader: `${
				webgl2
					? `#version 300 es

#define attribute in
#define varying out`
					: ''
			}
attribute vec2 uv;
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;
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
uniform sampler2D map;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(map, vUv) * vec4(color, opacity);
  ${alphaTest === 0 ? '' : `if (gl_FragColor.a < ${alphaTest}) discard;`}
}`
    },
    opt
  )
}
