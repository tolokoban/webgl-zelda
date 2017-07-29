uniform mat4 uniTransfo;
uniform mat4 uniCamera;

attribute vec3 attPosition;
attribute vec3 attNormal;
attribute vec3 attColor;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varCamera;

varying float varSlope;

void main() {
  vec4 pos = vec4(attPosition, 1);

  varSlope = clamp(attNormal.z, 0.0, 1.0);
  varPosition = attPosition;
  varNormal = mat3(uniCamera) * attNormal;
  varCamera = -normalize(uniCamera * pos).xyz;
                         
  gl_Position = uniTransfo * pos;
}
