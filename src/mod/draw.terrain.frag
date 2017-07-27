precision mediump float;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varCamera;
varying float varSlope;

varying vec3 varColor;

// Textures.
uniform sampler2D tex0;  // Grass
uniform sampler2D tex1;  // Rock
uniform sampler2D tex2;  // Sand

const vec3 SEA = vec3(0.2, 0.6, 1.0);


void main() {
  float z = varPosition.z;
  vec2 uv = varPosition.xy * 0.3;

  vec3 c0 = texture2D(tex0, uv).rgb;
  if( z < 1.5 ) {
    c0 = texture2D(tex2, uv).rgb;
  }
  else if( z < 1.75 ) {
    c0 = mix( texture2D(tex2, uv).rgb, c0, (z - 1.5) * 4.0);
  }

  vec3 c1 = texture2D(tex1, uv).rgb;
  float k = varSlope * 10.0 - 1.0;
  k = clamp( k + 0.5, 0.0, 1.0 );
  vec3 color = mix(c0, c1, k);

  vec3 normal = normalize(varNormal);
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
