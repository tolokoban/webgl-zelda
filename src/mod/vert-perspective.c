uniform float uniWidth;
uniform float uniHeight;
uniform float uniTime;
uniform float uniLookX;
uniform float uniLookY;
uniform float uniLookZ;
uniform float uniLookPhi;
uniform float uniLookTheta;
uniform float uniLookRho;

attribute vec3 attPosition;
attribute vec3 attColor;

varying vec3 varColor;
varying float varHeight;

const float DEPTH = 27.0;
const float DIST = 50.0;
const float ZOOM = 64.0;

const float PI = 3.141592653589793;
  
void main() {
  float theta = uniTime * 0.00012 * PI;
  float phi = (1.0 + sin(uniTime * 0.000842)) * .1 * PI;
  float rho = 50.0;

  float cosPhi = cos(phi);      // 1
  float sinPhi = sin(phi);      // 0
  float cosTheta = cos(theta);  // 1
  float sinTheta = sin(theta);  // 0
  
  float camX = cosPhi * cosTheta;    // 1
  float camY = cosPhi * sinTheta;    // 0
  float camZ = sinPhi;               // 0

  vec3 camVZ = -vec3(camX, camY, camZ);       // (-1,0,0)
  vec3 camVX = vec3(sinTheta, -cosTheta, 0);  // (0,-1,0)
  vec3 camVY = cross(camVZ, camVX);           // (0,0,1)

  camX = camX * rho + uniLookX;
  camY = camY * rho + uniLookY;
  camZ = camZ * rho + uniLookZ;

  camX = -0.0;
  camY = -0.0;
  camZ = -0.0;
  
  mat4 cameraMat = mat4(camVX.x, camVY.x, camVZ.x, 0.0,
                        camVX.y, camVY.y, camVZ.y, 0.0,
                        camVX.z, camVY.z, camVZ.z, 0.0,
                        -camX,     -camY,   -camZ, 1.0);

  vec4 pos = cameraMat * vec4(attPosition - vec3(uniLookX, uniLookY, uniLookZ), 1.0);
  float zz = pos.z;
  float xx = pos.x / uniWidth;
  float yy = pos.y / uniHeight;
  float w = ZOOM * DEPTH / (DEPTH + zz);
  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);
  
  varColor = attColor; 
  varHeight = attPosition.z;
}                
