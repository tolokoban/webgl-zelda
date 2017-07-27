precision mediump float;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varCamera;
varying vec2 varUV;
varying float varSlope;

varying vec3 varColor;

// Textures.
uniform sampler2D tex0;
uniform sampler2D tex1;


void main() {
  vec3 c0 = texture2D(tex0, varUV).rgb;
  vec3 c1 = texture2D(tex1, varUV).rgb;
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

  gl_FragColor = vec4(color, 1);
}
