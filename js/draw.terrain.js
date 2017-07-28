/** @module draw.terrain */require( 'draw.terrain', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
<<<<<<< HEAD
  "vert": "uniform mat4 uniTransfo;\r\nuniform mat4 uniCamera;\r\n\r\nattribute vec3 attPosition;\r\nattribute vec3 attNormal;\r\nattribute vec3 attColor;\r\n\r\nvarying vec3 varPosition;\r\nvarying vec3 varNormal;\r\nvarying vec3 varCamera;\r\nvarying float varSlope;\r\n\r\nvarying vec3 varColor;\r\n\r\nvoid main() {\r\n  vec4 pos = vec4(attPosition, 1);\r\n\r\n  varPosition = attPosition;\r\n  varNormal = mat3(uniCamera) * attNormal;\r\n  varCamera = -normalize(uniCamera * pos).xyz;\r\n  varSlope = (1.0 - attNormal.z);\r\n  varSlope *= varSlope;\r\n                         \r\n  gl_Position = uniTransfo * pos;\r\n\r\n  varColor = attColor;\r\n}\r\n",
  "frag": "precision mediump float;\r\n\r\nvarying vec3 varPosition;\r\nvarying vec3 varNormal;\r\nvarying vec3 varCamera;\r\nvarying float varSlope;\r\n\r\nvarying vec3 varColor;\r\n\r\n// Textures.\r\nuniform sampler2D tex0;  // Grass\r\nuniform sampler2D tex1;  // Rock\r\nuniform sampler2D tex2;  // Sand\r\n\r\nconst vec3 SEA = vec3(0.2, 0.6, 1.0);\r\n\r\n\r\nvoid main() {\r\n  float z = varPosition.z;\r\n  vec2 uv = varPosition.xy * 0.3;\r\n\r\n  vec3 c0 = texture2D(tex0, uv).rgb;\r\n  if( z < 1.5 ) {\r\n    c0 = texture2D(tex2, uv).rgb;\r\n  }\r\n  else if( z < 1.75 ) {\r\n    c0 = mix( texture2D(tex2, uv).rgb, c0, (z - 1.5) * 4.0);\r\n  }\r\n\r\n  vec3 c1 = texture2D(tex1, uv).rgb;\r\n  float k = varSlope * 10.0 - 0.25;\r\n  k = clamp( k + 0.5, 0.0, 1.0 );\r\n  vec3 color = mix(c0, c1, k);\r\n\r\n  vec3 normal = normalize(varNormal);\r\n  vec3 camera = normalize(varCamera);\r\n  float dir = dot(normal, camera);\r\n  dir = clamp(dir, 0.0, 1.0);\r\n  color = mix(vec3(0,0,0), color, dir);\r\n  if( dir < .4 ) {\r\n    color = mix(vec3(1,1,1), color, dir * 2.0 + .2);\r\n  }\r\n\r\n  if( z < 0.0 ) {\r\n    z = clamp( abs(z), 0.0, 1.0 );\r\n    color = mix( color, vec3(0,0,.3), 0.5);\r\n    color = mix( color, SEA, z );\r\n    if( z < 0.1 ) {\r\n      color = mix( color, SEA, 0.5 );\r\n    }\r\n  }\r\n  /*\r\n  // Damier.\r\n  int cell = 0;\r\n  if( mod(varPosition.x, 2.0) < 1.0) {\r\n    cell += 1;\r\n  }\r\n  if( mod(varPosition.y, 2.0) < 1.0) {\r\n    cell += 1;\r\n  }\r\n  if( cell == 1 ) {\r\n    color = mix(color, vec3(1, 0.5, 0), 0.4);\r\n  }  \r\n*/\r\n  gl_FragColor = vec4(color, 1);\r\n}\r\n"};
=======
  "vert": "uniform mat4 uniTransfo;\nuniform mat4 uniCamera;\n\nattribute vec3 attPosition;\nattribute vec3 attNormal;\nattribute vec3 attColor;\n\nvarying vec3 varPosition;\nvarying vec3 varNormal;\nvarying vec3 varCamera;\nvarying float varSlope;\n\nvarying vec3 varColor;\n\nvoid main() {\n  vec4 pos = vec4(attPosition, 1);\n\n  varPosition = attPosition;\n  varNormal = mat3(uniCamera) * attNormal;\n  varCamera = -normalize(uniCamera * pos).xyz;\n  varSlope = (1.0 - attNormal.z);\n  varSlope *= varSlope;\n                         \n  gl_Position = uniTransfo * pos;\n\n  varColor = attColor;\n}\n",
  "frag": "precision mediump float;\n\nvarying vec3 varPosition;\nvarying vec3 varNormal;\nvarying vec3 varCamera;\nvarying float varSlope;\n\nvarying vec3 varColor;\n\n// Textures.\nuniform sampler2D tex0;  // Grass\nuniform sampler2D tex1;  // Rock\nuniform sampler2D tex2;  // Sand\n\nconst vec3 SEA = vec3(0.2, 0.6, 1.0);\n\n\nvoid main() {\n  float z = varPosition.z;\n  vec2 uv = varPosition.xy * 0.3;\n\n  vec3 c0 = texture2D(tex0, uv).rgb;\n  if( z < 1.5 ) {\n    c0 = texture2D(tex2, uv).rgb;\n  }\n  else if( z < 1.75 ) {\n    c0 = mix( texture2D(tex2, uv).rgb, c0, (z - 1.5) * 4.0);\n  }\n\n  vec3 c1 = texture2D(tex1, uv).rgb;\n  float k = varSlope * 10.0 - 1.0;\n  k = clamp( k + 0.5, 0.0, 1.0 );\n  vec3 color = mix(c0, c1, k);\n\n  vec3 normal = normalize(varNormal);\n  vec3 camera = normalize(varCamera);\n  float dir = dot(normal, camera);\n  dir = clamp(dir, 0.0, 1.0);\n  color = mix(vec3(0,0,0), color, dir);\n  if( dir < .4 ) {\n    color = mix(vec3(1,1,1), color, dir * 2.0 + .2);\n  }\n\n  if( z < 0.0 ) {\n    z = clamp( abs(z), 0.0, 1.0 );\n    color = mix( color, vec3(0,0,.3), 0.5);\n    color = mix( color, SEA, z );\n    if( z < 0.1 ) {\n      color = mix( color, SEA, 0.5 );\n    }\n  }\n\n  gl_FragColor = vec4(color, 1);\n}\n"};
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
  "use strict";

var M = require("webgl.math").m4;
var Util = require("util");
var Program = require( "webgl.program" );

/**
 * @param {Object} opts.gl - Contexte WebGL.
 * @param {Float32Array} opts.vert - Données pour les vertex. Les attributs
 * sont X, Y, Z, nX, nY, nZ, R, G et B.
 * @param {UInt16Array} opts.elem - Index  sur les vertex pour un affichage
 * en TRIANGLE_STRIP.
 */
function Terrain( opts ) {
  console.info("[draw.terrain] opts=", opts);
  
  var gl = opts.gl;
  var vert = opts.vert;
  var elem = opts.elem;
  
  this._terrain = opts.terrain;
  //this._vertData = vert;
  this._vertData = this._terrain.vert;
  this._vertBuff = gl.createBuffer();
  //this._elemData = elem;
  this._elemBuff = gl.createBuffer();

  this.gl = gl;
  
  // Create program.
  this._prg = new Program( gl, {
    vert: GLOBAL.vert,
    frag: GLOBAL.frag
  } );

  initTextures.call( this );
}


Terrain.prototype.draw = function( world ) {
  var gl = world.gl;
  var prg = this._prg;

  prg.use();
  prg.$uniTransfo = world.transfo;
  prg.$uniCamera = world.camera;

  // Textures.
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, this._tex0 );
  prg.$tex0 = 0;
  gl.activeTexture( gl.TEXTURE1 );
  gl.bindTexture( gl.TEXTURE_2D, this._tex1 );
  prg.$tex1 = 1;
  gl.activeTexture( gl.TEXTURE2 );
  gl.bindTexture( gl.TEXTURE_2D, this._tex2 );
  prg.$tex2 = 2;
  
  // Bind attributes.
  prg.bindAttribs( this._vertBuff, "attPosition", "attNormal" );
  gl.bindBuffer( gl.ARRAY_BUFFER, this._vertBuff );
  gl.bufferData( gl.ARRAY_BUFFER, this._vertData, gl.STATIC_DRAW );

  var elems = this._terrain.getElems( world.camX, world.camY );
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._elemBuff );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, elems, gl.STATIC_DRAW );

  // Draw.
  gl.drawElements( gl.TRIANGLE_STRIP, elems.length, gl.UNSIGNED_SHORT, 0 );  
};


module.exports = Terrain;


function initTextures() {
  var that = this;

  var gl = this.gl;  

  this._canvas0 = Util.createCanvas("#0f0");
  this._tex0 = Util.createTextureWrap( gl );

  this._canvas1 = Util.createCanvas("#830");
  this._tex1 = Util.createTextureWrap( gl );

  this._canvas2 = Util.createCanvas("#dc7");
  this._tex2 = Util.createTextureWrap( gl );

  updateTextures.call( this );

  Util.loadImages({
    grass: "css/gfx/grass.jpg",
    rock: "css/gfx/rock.jpg",
    sand: "css/gfx/sand.jpg"
  }).then(function( images ) {
    var ctx = that._canvas0.getContext( '2d' );
    ctx.drawImage( images.grass, 0, 0, 256, 256 );
    ctx = that._canvas1.getContext( '2d' );
    ctx.drawImage( images.rock, 0, 0, 256, 256 );
    ctx = that._canvas2.getContext( '2d' );
    ctx.drawImage( images.sand, 0, 0, 256, 256 );
    
    updateTextures.call( that );    
  });  
}


function updateTextures() {
  var gl = this.gl;
  
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, this._tex0 );
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
    gl.RGBA, gl.UNSIGNED_BYTE,
    this._canvas0 );
  
  gl.activeTexture( gl.TEXTURE1 );
  gl.bindTexture( gl.TEXTURE_2D, this._tex1 );
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
    gl.RGBA, gl.UNSIGNED_BYTE,
    this._canvas1 );
  
  gl.activeTexture( gl.TEXTURE2 );
  gl.bindTexture( gl.TEXTURE_2D, this._tex2 );
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
    gl.RGBA, gl.UNSIGNED_BYTE,
    this._canvas2 );
}


  
module.exports._ = _;
/**
 * @module draw.terrain
 * @see module:$
 * @see module:webgl.math
 * @see module:util
 * @see module:webgl.program

 */
});