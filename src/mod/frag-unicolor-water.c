precision mediump float;

uniform float uniTimeFrag;

varying vec3 varColor;
varying vec3 varInfo;

const vec4 TRANSPARENT = vec4(0.0, 0.0, 1.0, 0.0);
const vec4 WHITE = vec4(.4, .8, 1.0, 1.0);
const float DUR = 1800.0;

void main() {
  float u = varInfo.x;
  float v = varInfo.y;
  float t = varInfo.z;

  if (uniTimeFrag < t || t + DUR < uniTimeFrag) {
    gl_FragColor = TRANSPARENT;
    return;
  }

  float r = sqrt(u*u + v*v);
  float r2 = (uniTimeFrag - t) / DUR;

  if ((r2 > r && r > 0.8 * r2) || (.55 * r2 > r*r && r*r > 0.5 * r2)) {
    gl_FragColor = vec4(WHITE.rgb, mix(.3, .0, r2));    
  } else {
    gl_FragColor = TRANSPARENT;    
  }
}
