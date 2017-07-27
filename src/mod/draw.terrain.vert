uniform mat4 uniTransfo;
uniform mat4 uniCamera;

attribute vec3 attPosition;
attribute vec3 attNormal;
attribute vec3 attColor;

varying vec3 varPosition;
varying vec3 varNormal;
varying vec3 varCamera;
varying vec2 varUV;
varying float varSlope;

varying vec3 varColor;

void main() {
  vec4 pos = vec4(attPosition, 1);

  varPosition = attPosition;
  varNormal = mat3(uniCamera) * attNormal;
  varCamera = -normalize(uniCamera * pos).xyz;
  varSlope = (1.0 - attNormal.z);
  varSlope *= varSlope;
  varUV = attPosition.xy * 0.3;
                         
  gl_Position = uniTransfo * pos;

  varColor = attColor;
}
