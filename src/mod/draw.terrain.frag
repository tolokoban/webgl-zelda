precision mediump float;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varColor;

const vec3 LIGHT = vec3(0,0,1);

void main() {
  vec3 norm = normalize(varNormal);
  float dir = 1.0 - dot(norm, LIGHT);
  dir *= 0.4;

  vec3 color = mix(varColor, vec3(0,0,0), dir);

  gl_FragColor = vec4(color, 1);
}
