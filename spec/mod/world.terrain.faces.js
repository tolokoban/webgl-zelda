require("world.terrain.faces",function(r,t){function o(){return e(i,arguments)}function n(r,t,o){if(o<0||o>=r.length)return-2;var n=r[o];if(t<0||t>=n.length)return-2;var a=n[t];return a<0?-2:a}function a(r,t,o,n,a,i,e,l,h,c,f,s,u,v,m,g){return"undefined"==typeof g&&(g=0),[r,t,o,u,v,m,g,n,a,i,u,v,m,g,e,l,h,u,v,m,g,r,t,o,u,v,m,g,e,l,h,u,v,m,g,c,f,s,u,v,m,g]}var i={en:{}},e=require("$").intl,l=require("levels"),h=require("tfw.webgl"),c=function(r){this._gl=r,this._prg=new h.Program(r,{vert:f.vert,frag:f.frag})};c.prototype.loadTerrain=function(r){var t=0,o=.3,i=0,e=.4,h=.2,c=0,f=.3,s=.15,u=0,v=[],m=l[r].alti;m.length,m[0].length;m.forEach(function(r,l){r.forEach(function(r,g){if(!(r<0)){var T;v=v.concat(a(g+0,l+0,r,g+0,l+1,r,g+1,l+1,r,g+1,l+0,r,t,o,i,r)),T=n(m,g,l-1),T<r&&(v=v.concat(a(g+0,l+0,r,g+1,l+0,r,g+1,l+0,T,g+0,l+0,T,e,h,c,r))),T=n(m,g,l+1),T<r&&(v=v.concat(a(g+1,l+1,r,g+0,l+1,r,g+0,l+1,T,g+1,l+1,T,e,h,c,r))),T=n(m,g-1,l),T<r&&(v=v.concat(a(g+0,l+0,r,g+0,l+0,T,g+0,l+1,T,g+0,l+1,r,f,s,u,r))),T=n(m,g+1,l),T<r&&(v=v.concat(a(g+1,l+0,T,g+1,l+0,r,g+1,l+1,r,g+1,l+1,T,f,s,u,r)))}})}),console.info("[world] arr.length / 7=...",v.length/7),this._arrAttributes=new Float32Array(v),this._bufAttributes=this._gl.createBuffer()},c.prototype.render=function(r,t,o){var n=this._gl,a=this._prg,i=this._arrAttributes.BYTES_PER_ELEMENT;a.use(),n.enable(n.CULL_FACE),n.cullFace(n.BACK),a.$uniWidth=t,a.$uniHeight=o,a.$uniTime=r,a.$uniLookX=this.lookX,a.$uniLookY=this.lookY,a.$uniLookZ=this.lookZ,a.$uniLookPhi=this.lookPhi,a.$uniLookTheta=this.lookTheta,a.$uniLookRho=this.lookRho,n.bindBuffer(n.ARRAY_BUFFER,this._bufAttributes),n.bufferData(n.ARRAY_BUFFER,this._arrAttributes,n.STATIC_DRAW),n.enableVertexAttribArray(a.attribs.attPosition),n.vertexAttribPointer(a.attribs.attPosition,3,n.FLOAT,!1,7*i,0),n.enableVertexAttribArray(a.attribs.attColor),n.vertexAttribPointer(a.attribs.attColor,3,n.FLOAT,!1,7*i,3*i),n.enableVertexAttribArray(a.attribs.attThreshold),n.vertexAttribPointer(a.attribs.attThreshold,1,n.FLOAT,!1,7*i,6*i),n.enable(n.DEPTH_TEST),n.drawArrays(n.TRIANGLES,0,this._arrAttributes.length/7)},t.exports=c;var f={vert:"uniform float uniWidth;\r\nuniform float uniHeight;\r\nuniform float uniTime;\r\nuniform float uniLookX;\r\nuniform float uniLookY;\r\nuniform float uniLookZ;\r\nuniform float uniLookPhi;\r\nuniform float uniLookTheta;\r\nuniform float uniLookRho;\r\n\r\nattribute vec3 attPosition;\r\nattribute vec3 attColor;\r\nattribute float attThreshold;\r\n\r\nvarying vec3 varColor;\r\nvarying float varHeight;\r\nvarying float varThreshold;\r\n\r\nconst float DEPTH = 270.0;\r\nconst float ZOOM = 100000.0;\r\n\r\nconst float PI = 3.141592653589793;\r\n  \r\nvoid main() {\r\n  float theta = uniLookTheta;\r\n  float phi = uniLookPhi;\r\n  float rho = uniLookRho;\r\n  float lookX = uniLookX;\r\n  float lookY = uniLookY;\r\n  float lookZ = uniLookZ;\r\n\r\n  float cosPhi = cos(phi);      // 1\r\n  float sinPhi = sin(phi);      // 0\r\n  float cosTheta = cos(theta);  // 1\r\n  float sinTheta = sin(theta);  // 0\r\n  \r\n  float camX = cosPhi * cosTheta;    // 1\r\n  float camY = cosPhi * sinTheta;    // 0\r\n  float camZ = sinPhi;               // 0\r\n\r\n  vec3 camVZ = -vec3(camX, camY, camZ);       // (-1,0,0)\r\n  vec3 camVX = vec3(sinTheta, -cosTheta, 0);  // (0,-1,0)\r\n  vec3 camVY = cross(camVZ, camVX);           // (0,0,1)\r\n\r\n  camX = camX * rho + lookX;\r\n  camY = camY * rho + lookY;\r\n  camZ = camZ * rho + lookZ;\r\n\r\n  mat3 cameraMat = mat3(camVX.x, camVY.x, camVZ.x,\r\n                        camVX.y, camVY.y, camVZ.y,\r\n                        camVX.z, camVY.z, camVZ.z);\r\n\r\n  vec3 pos = cameraMat * (attPosition - vec3(camX, camY, camZ));\r\n  float zz = pos.z;\r\n  float xx = pos.x / uniWidth;\r\n  float yy = pos.y / uniHeight;\r\n  float w = ZOOM / (rho * (DEPTH + zz));\r\n  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);\r\n  \r\n  varColor = attColor; \r\n  varHeight = attPosition.z;\r\n  varThreshold = attThreshold;\r\n}                \r\n",frag:"precision mediump float;\r\n\r\nvarying vec3 varColor;\r\nvarying float varHeight;\r\nvarying float varThreshold;\r\n\r\n\r\nconst vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);\r\nconst vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);\r\n\r\nvoid main() {\r\n  float alpha;\r\n\r\n  gl_FragColor = vec4(varColor, 1.0);\r\n  if (varHeight < -1.0) {\r\n    if (varHeight > -1.1) {\r\n      gl_FragColor = BLUE;\r\n    } else {\r\n      alpha = -varHeight * .5;\r\n      gl_FragColor = mix( gl_FragColor, BLUE, alpha );\r\n    }\r\n  } else {\r\n    alpha = clamp((varHeight + 1.0) / 8.0, 0.0, 1.0);\r\n    gl_FragColor = mix( gl_FragColor, WHITE, alpha );\r\n  }\r\n\r\n  float diff = varThreshold - varHeight;\r\n  if (diff > 0.0 && diff < .2) {\r\n    gl_FragColor = vec4(\r\n      mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), (.2 - diff) * 5.0),\r\n      1.0);\r\n  }\r\n}\r\n"};t.exports._=o});
//# sourceMappingURL=world.terrain.faces.js.map