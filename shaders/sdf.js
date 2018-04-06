var assign = require('object-assign')

module.exports = function createSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map
  var palette = opt.palette
  var maxPaletteLength = Math.max(palette ? palette.length : 1, 8);

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity
  delete opt.palette

  if (!palette) {
    var tColor = new THREE.Color(color);
    var colorVec = new THREE.Vector3(tColor.r, tColor.g, tColor.b);
    palette = [colorVec];
  }

  var paletteElseIfs = [];
  for (var i=1; i<maxPaletteLength; i++) {
    paletteElseIfs.push('    else if (pIdx == '+i+'.0) pColor = palette['+i+'];');
  }

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      palette: { type: 'v3v', value: palette }
    },

    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'uniform vec3 palette['+maxPaletteLength+'];',
      'varying vec2 vUv;',
      'varying vec3 pColor;',
      'varying float bold;',
      'void main() {',
      'vUv = uv;',
      '    float pIdx = floor(position.a);',
      '    bold = 0.0;',
      '    if (pIdx >= 256.0) {',
      '      bold = 1.0;',
      '      pIdx -= 256.0;',
      '    }',
      '    pIdx = mod(pIdx, '+maxPaletteLength+'.0);',
      '    if (pIdx == 0.0) pColor = palette[0];'
    ].concat(paletteElseIfs).concat([
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1);',
      '}'
    ]).join('\n'),

    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform sampler2D map;',
      'varying vec3 pColor;',
      'varying vec2 vUv;',
      'varying float bold;',

      'float aastep(float value) {',
      '  #ifdef GL_OES_standard_derivatives',
      '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;',
      '  #else',
      '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));',
      '  #endif',
      '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value + bold * 0.125);',
      '}',

      'void main() {',
      '    vec4 texColor = texture2D(map, vUv, -100.0);',
      '    float valpha = 0.25*aastep(texColor.a);',

      '  #ifdef GL_OES_standard_derivatives',

      '    texColor = texture2D(map, vUv+0.5*vec2(dFdx(vUv.x), dFdy(vUv.y)), -100.0);',
      '    valpha += 0.25*aastep(texColor.a);',
      '    texColor = texture2D(map, vUv+0.5*vec2(dFdx(vUv.x), 0.0), -100.0);',
      '    valpha += 0.25*aastep(texColor.a);',
      '    texColor = texture2D(map, vUv+0.5*vec2(0.0, dFdy(vUv.y)), -100.0);',
      '    valpha += 0.25*aastep(texColor.a);',

      '    float maxD = max(dFdx(vUv.x), dFdy(vUv.y));',
      '    valpha *= smoothstep(0.07, 0.01, maxD);', // Fade out small text (= when UV derivative gets big)

      '  #else',
      '    valpha *= 4.0;',
      '  #endif',


      '    gl_FragColor = vec4(pColor, opacity * valpha);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt)
}
