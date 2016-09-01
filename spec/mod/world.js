require("world",function(t,r){function n(){return s(a,arguments)}function e(t,r,n){var e=this._gl,i=this._prg,o=this._arrAttributes.BYTES_PER_ELEMENT;i.use(),e.uniform1f(i.uniforms.uniWidth,r),e.uniform1f(i.uniforms.uniHeight,n),e.uniform1f(i.uniforms.uniTime,t),e.bindBuffer(e.ARRAY_BUFFER,this._bufAttributes),e.bufferData(e.ARRAY_BUFFER,this._arrAttributes,e.STATIC_DRAW),e.enableVertexAttribArray(i.attribs.attPosition),e.vertexAttribPointer(i.attribs.attPosition,3,e.FLOAT,!1,6*o,0),e.enableVertexAttribArray(i.attribs.attColor),e.vertexAttribPointer(i.attribs.attColor,3,e.FLOAT,!1,6*o,3*o),e.enable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLES,0,this._arrAttributes.length/6)}function i(t,r,n,e,i,o,a,s,u,l,c,f,v,m,T){return[t,r,n,v,m,T,e,i,o,v,m,T,a,s,u,v,m,T,t,r,n,v,m,T,a,s,u,v,m,T,l,c,f,v,m,T]}function o(){var t,r,n=[];for(t=0;t<arguments.length;t++)r=arguments[t],n=n.concat(i.apply(null,r));return console.info("[world] attributes=...",n),n}var a={en:{}},s=require("$").intl,u=(require("levels"),require("tfw.webgl")),l=function(t){this._gl=t,this._prg=new u.Program(t,{vert:c["vert-perspective"],frag:c["frag-unicolor"]})};l.prototype.loadTerrain=function(t){var r=o([0,0,1,0,1,1,1,1,1,1,0,1,.3,.5,0],[0,0,1,1,0,1,1,0,0,0,0,0,.6,0,0],[1,1,1,2,1,1,2,1,0,1,1,0,.5,0,0],[0,1,1,0,3,1,2,3,1,2,1,1,.5,.8,0]);this._arrAttributes=new Float32Array(r),this._bufAttributes=this._gl.createBuffer()},l.prototype.render=function(t,r,n){var i=this._gl;i.viewport(0,0,r,n),i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),e.call(this,t,r,n)},r.exports=l;var c={"vert-perspective":"uniform float uniWidth;\nuniform float uniHeight;\nuniform float uniTime;\nuniform vec3 uniLookAt;\n\nattribute vec3 attPosition;\nattribute vec3 attColor;\n\nvarying vec3 varColor;\n\nconst float DEPTH = 700.0;\nconst float DIST = 50.0;\n\nconst float ZOOM = 64.0;\n\nvoid main() {\n  vec3 cameraPos = vec3(0.0, -DIST, DIST);\n  vec3 z = normalize(vec3( 0.0, DIST, -DIST ));\n  vec3 y = normalize(vec3( 0.0, DIST, DIST ));\n  vec3 x = vec3(1.0, 0.0, 0.0);\n  mat4 cameraMat = mat4(x.x, x.y, x.z, -cameraPos.x,\n                        y.x, y.y, y.z, -cameraPos.y,\n                        z.x, z.y, z.z, -cameraPos.z,\n                        0.0, 0.0, 0.0, 1.0);\n\n  vec4 pos = cameraMat * vec4(attPosition * ZOOM, 1.0);\n\n  //vec3 pos = attPosition * ZOOM;\n  float zz = pos.z;\n  float xx = pos.x / uniWidth;\n  float yy = pos.y / uniHeight;\n  float w = DEPTH / (DEPTH + zz);\n  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);\n  \n  varColor = attColor; \n}                \n","frag-unicolor":"precision mediump float;\n\nvarying vec3 varColor;\n\nvoid main() {\n  gl_FragColor = vec4(varColor, 1.0);\n}\n"};r.exports._=n});
//# sourceMappingURL=world.js.map