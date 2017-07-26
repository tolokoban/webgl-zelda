uniform mat4 uniTransfo;
uniform mat3 uniCam3;

attribute vec3 attPosition;

varying vec3 varPosition;

void main() {
  varPosition = attPosition;
  vec4 pos = vec4(attPosition, 1);
  gl_Position = uniTransfo * pos;
}
