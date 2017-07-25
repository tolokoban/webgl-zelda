uniform mat4 uniTransfo;
uniform mat3 uniCam3;

attribute vec3 attPosition;
attribute vec3 attNormal;
attribute vec3 attColor;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varColor;

void main() {
  varColor = attColor;
  varPosition = attPosition;
  varNormal = uniCam3 * attNormal;
  vec4 pos = vec4(attPosition, 1);
  gl_Position = uniTransfo * pos;
}
