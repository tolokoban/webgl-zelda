precision mediump float;

uniform float uniTimeFrag;

varying vec3 varPosition;
varying float varFlag;

const float PI = 3.141592653589793;

const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 DARK_GREEN = vec4(0.0, 0.7, 0.0, 1.0);

void main() {
  gl_FragColor = mix(GREEN, DARK_GREEN, varFlag);
}
