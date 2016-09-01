uniform float uniWidth;
uniform float uniHeight;
uniform float uniTime;
uniform vec3 uniLookAt;

attribute vec3 attPosition;
attribute vec3 attColor;

varying vec3 varColor;

const float DEPTH = 700.0;
const float DIST = 50.0;

const float ZOOM = 64.0;

void main() {
  vec3 cameraPos = vec3(0.0, -DIST, DIST);
  vec3 z = normalize(vec3( 0.0, DIST + DIST * .5 * cos(uniTime * .001), -DIST ));
  vec3 y = vec3( 0.0, -z.z, z.y );
  vec3 x = vec3(1.0, 0.0, 0.0);
  mat4 cameraMat = mat4(x.x, x.y, x.z, -cameraPos.x,
                        y.x, y.y, y.z, -cameraPos.y,
                        z.x, z.y, z.z, -cameraPos.z,
                        0.0, 0.0, 0.0, 1.0);

  vec4 pos = cameraMat * vec4(attPosition * ZOOM, 1.0);

  //vec3 pos = attPosition * ZOOM;
  float zz = pos.z;
  float xx = pos.x / uniWidth;
  float yy = pos.y / uniHeight;
  float w = DEPTH / (DEPTH + zz);
  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);
  
  varColor = attColor; 
}                
