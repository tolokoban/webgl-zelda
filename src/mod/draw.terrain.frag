precision mediump float;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varCamera;

varying float varSlope;

// Textures.
uniform sampler2D tex0;  // Grass
uniform sampler2D tex1;  // Rock
uniform sampler2D tex2;  // Sand

const vec3 SEA = vec3(0.2, 0.6, 1.0);

const float SAND_Z = 1.5;
const float GRASS_Z = 1.8;

const float ROCK_MAX = cos(radians( 25.0 )); // Au dessus, c'est de l'herbe.
const float ROCK_MIN = cos(radians( 40.0 )); // En dessous, c'est du rock.


void main() {
  float z = varPosition.z;
  vec2 uv = varPosition.xy * 0.3;
  float alpha;
  vec3 normal = normalize(varNormal);
  float slope = varSlope;
  vec3 color;

  if( slope < ROCK_MIN ) {
    // Du pur rocher.
    color = texture2D(tex1, uv).rgb;
  } else {    
    if( z < SAND_Z ) {
      color = texture2D(tex2, uv).rgb;
    }
    else if( z > GRASS_Z ) {
      color = texture2D(tex0, uv).rgb;
    }
    else {
      alpha = (z - SAND_Z) / (GRASS_Z - SAND_Z);
      color = mix( texture2D(tex2, uv).rgb, texture2D(tex0, uv).rgb, alpha);
    }
    if( slope < ROCK_MAX ) {
      // Petit mix avec du rocher.
      alpha = (slope - ROCK_MIN) / (ROCK_MAX - ROCK_MIN);
      color = mix( texture2D(tex1, uv).rgb, color, alpha);
    }
  }

  vec3 camera = normalize(varCamera);
  float dir = dot(normal, camera);
  dir = clamp(dir, 0.0, 1.0);
  color = mix(vec3(0,0,0), color, dir);
  if( dir < .4 ) {
    color = mix(vec3(1,1,1), color, dir * 2.0 + .2);
  }

  if( z < 0.0 ) {
    z = clamp( abs(z), 0.0, 1.0 );
    color = mix( color, vec3(0,0,.3), 0.5);
    color = mix( color, SEA, z );
    if( z < 0.1 ) {
      color = mix( color, SEA, 0.5 );
    }
  }

  gl_FragColor = vec4(color, 1);
}
