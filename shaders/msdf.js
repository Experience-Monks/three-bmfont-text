var assign = require('object-assign')

module.exports = function createMSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map
  var negate = typeof opt.negate === 'boolean' ? opt.negate : true

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity
  delete opt.negate

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
							
#ifdef GL_OES_standard_derivatives
	#extension GL_OES_standard_derivatives : enable
#endif

precision ${precision} float;

uniform float opacity;
uniform vec3 color;
uniform sampler2D map;

varying vec2 vUv;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

void main() {
	vec3 samp = ${negate ? '1.0 - ' : ''} texture2D(map, vUv).rgb;
	float sigDist = median(samp.r, samp.g, samp.b) - 0.5;
	float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
	gl_FragColor = vec4(color.xyz, alpha * opacity);
	${alphaTest === 0 ? '' : `if (gl_FragColor.a < ${alphaTest}) discard;`}
}`
    },
    opt
  )
}
