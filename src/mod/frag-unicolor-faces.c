precision mediump float;

uniform float uniTimeFrag;
varying vec3 varColor;
varying vec3 varPosition;
varying float varThreshold;

const float PI = 3.141592653589793;

const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 GREEN = vec4(0.0, 0.7, 0.0, 1.0);
const vec4 WATER = vec4(0.5, 0.5, 1.0, 0.0);
const vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
  // Niveau de la mer qui fluctue avec le temps.
  float sea = -1.0 + sin(uniTimeFrag * .0010157) * .2;
  float alpha;

  // Couleur de base
  gl_FragColor = vec4(varColor, 1.0);

  if (varPosition.z < sea) {
    // On est SOUS le niveau de la mer.
    float threshold = sea - 0.2 + 0.1 * sin(4.0*(varPosition.x + varPosition.y) + uniTimeFrag * .004)
      * sin(3.771*(varPosition.x - varPosition.y) + uniTimeFrag * .004);
    if (varPosition.z > threshold) {
      alpha = (varPosition.z - threshold)/(sea - threshold);
      gl_FragColor = mix(WATER, BLUE, 1.0 - alpha);
    } else {
      alpha = -varPosition.z * .5;
      gl_FragColor = mix( gl_FragColor, BLUE, alpha );
    }
  } else {
    // On est au DESSUS du niveau de la mer.
    alpha = clamp((varPosition.z + 1.0) / 8.0, 0.0, 1.0);
    // Plus on monte, plus c'est clair.
    gl_FragColor = mix( gl_FragColor, WHITE, alpha );
    //Liseré noir.
    float diff = varThreshold - varPosition.z;
    float petal = 0.2 * abs(sin((varPosition.x + varPosition.y) * 2.0 * PI));
    if (diff > 0.0 && diff < petal) {
      gl_FragColor = GREEN;
    }
    else if (diff > petal + 0.0 && diff < petal + .2) {
      gl_FragColor = vec4(mix(gl_FragColor.rgb,
                              vec3(0.0, 0.0, 0.0),
                              (petal + .2 - diff) * 5.0),
                          1.0);
    }
  }

}
