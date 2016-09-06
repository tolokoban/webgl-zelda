precision mediump float;

uniform float uniTimeFrag;
varying vec3 varColor;
varying vec3 varPosition;
varying float varThreshold;


const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
  float alpha;
  float sea = -1.0 + sin(uniTimeFrag * .001) * .2;

  gl_FragColor = vec4(varColor, 1.0);
  if (varPosition.z < sea) {
    if (varPosition.z > sea - 0.1) {
      gl_FragColor = BLUE;
    } else {
      alpha = -varPosition.z * .5;
      gl_FragColor = mix( gl_FragColor, BLUE, alpha );
    }
  } else {
    alpha = clamp((varPosition.z + 1.0) / 8.0, 0.0, 1.0);
    gl_FragColor = mix( gl_FragColor, WHITE, alpha );
  }

  float diff = varThreshold - varPosition.z;
  if (diff > 0.0 && diff < .2) {
    gl_FragColor = vec4(
      mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), (.2 - diff) * 5.0),
      1.0);
  }
}
