precision mediump float;

varying vec3 varColor;
varying float varHeight;

const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
  float alpha;
  
  gl_FragColor = vec4(varColor, 1.0);

  if (varHeight < -1.0) {
    if (varHeight > -1.1) {
      gl_FragColor = BLUE;
    } else {
      alpha = -varHeight * .5;
      gl_FragColor = mix( gl_FragColor, BLUE, alpha );
    }
  } else {
    alpha = clamp((varHeight + 1.0) / 8.0, 0.0, 1.0);
    gl_FragColor = mix( gl_FragColor, WHITE, alpha );
  }
}
