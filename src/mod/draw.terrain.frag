precision mediump float;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varCamera;
varying vec3 varColor;

void main() {
  vec3 color;
  vec3 normal = normalize(varNormal);
  vec3 camera = normalize(varCamera);
  float dir = dot(normal, camera);  
  dir = clamp(dir, 0.0, 1.0);  
  if( dir > 0.5) {    
    color = mix(varColor, vec3(1,1,1), dir - 0.5);
  } else {
    color = mix(varColor, vec3(0,0,0), 0.5 - dir);
  }

  gl_FragColor = vec4(color, 1);
}
