precision mediump float;

uniform float uniTimeFrag;

varying vec3 varPosition;
varying vec2 varFlag;

const float PI = 3.141592653589793;

const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 DARK_GREEN = vec4(0.0, 0.0, 0.0, 1.0);

void main() {
  float d = max(abs(varFlag.x), abs(varFlag.y));
  gl_FragColor = mix(GREEN, DARK_GREEN, d);
}
