/** @module draw.terrain */require( 'draw.terrain', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vert": "uniform mat4 uniTransfo;\nuniform mat4 uniCamera;\n\nattribute vec3 attPosition;\nattribute vec3 attNormal;\nattribute vec3 attColor;\n\nvarying vec3 varPosition;\nvarying vec3 varNormal;\nvarying vec3 varCamera;\nvarying float varSlope;\n\nvarying vec3 varColor;\n\nvoid main() {\n  vec4 pos = vec4(attPosition, 1);\n\n  varPosition = attPosition;\n  varNormal = mat3(uniCamera) * attNormal;\n  varCamera = -normalize(uniCamera * pos).xyz;\n  varSlope = (1.0 - attNormal.z);\n  varSlope *= varSlope;\n                         \n  gl_Position = uniTransfo * pos;\n\n  varColor = attColor;\n}\n",
  "frag": "precision mediump float;\n\nvarying vec3 varPosition;\nvarying vec3 varNormal;\nvarying vec3 varCamera;\nvarying float varSlope;\n\nvarying vec3 varColor;\n\n// Textures.\nuniform sampler2D tex0;  // Grass\nuniform sampler2D tex1;  // Rock\nuniform sampler2D tex2;  // Sand\n\nconst vec3 SEA = vec3(0.2, 0.6, 1.0);\n\n\nvoid main() {\n  float z = varPosition.z;\n  vec2 uv = varPosition.xy * 0.3;\n\n  vec3 c0 = texture2D(tex0, uv).rgb;\n  if( z < 1.5 ) {\n    c0 = texture2D(tex2, uv).rgb;\n  }\n  else if( z < 1.75 ) {\n    c0 = mix( texture2D(tex2, uv).rgb, c0, (z - 1.5) * 4.0);\n  }\n\n  vec3 c1 = texture2D(tex1, uv).rgb;\n  float k = varSlope * 10.0 - 1.0;\n  k = clamp( k + 0.5, 0.0, 1.0 );\n  vec3 color = mix(c0, c1, k);\n\n  vec3 normal = normalize(varNormal);\n  vec3 camera = normalize(varCamera);\n  float dir = dot(normal, camera);\n  dir = clamp(dir, 0.0, 1.0);\n  color = mix(vec3(0,0,0), color, dir);\n  if( dir < .4 ) {\n    color = mix(vec3(1,1,1), color, dir * 2.0 + .2);\n  }\n\n  if( z < 0.0 ) {\n    z = clamp( abs(z), 0.0, 1.0 );\n    color = mix( color, vec3(0,0,.3), 0.5);\n    color = mix( color, SEA, z );\n    if( z < 0.1 ) {\n      color = mix( color, SEA, 0.5 );\n    }\n  }\n\n  gl_FragColor = vec4(color, 1);\n}\n"};
  "use strict";

var M = require("webgl.math").m4;
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
  
  this._vertData = vert;
  this._vertBuff = gl.createBuffer();
  this._elemData = elem;
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

  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._elemBuff );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this._elemData, gl.STATIC_DRAW );

  // Draw.
  gl.drawElements( gl.TRIANGLE_STRIP, this._elemData.length, gl.UNSIGNED_SHORT, 0 );  
};


module.exports = Terrain;


function newCanvas(color) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute("width", 256);
  canvas.setAttribute("height", 256);
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
  return canvas;
}


function initTextures() {
  var that = this;

  var gl = this.gl;  

  this._canvas0 = newCanvas("#0f0");
  this._canvas0.setAttribute("width", 256);
  this._canvas0.setAttribute("height", 256);
  this._tex0 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, this._tex0 );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

  this._canvas1 = newCanvas("#830");
  this._canvas1.setAttribute("width", 256);
  this._canvas1.setAttribute("height", 256);
  this._tex1 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, this._tex1 );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

  this._canvas2 = newCanvas("#dc7");
  this._canvas2.setAttribute("width", 256);
  this._canvas2.setAttribute("height", 256);
  this._tex2 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, this._tex2 );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

  updateTextures.call( this );

  var img0 = new Image();
  img0.src = "css/gfx/grass.jpg";
  img0.onload = function() {
    console.log("GRASS");
    var ctx = that._canvas0.getContext( '2d' );
    ctx.drawImage( img0, 0, 0, 256, 256 );
    updateTextures.call( that );
  };
  
  var img1 = new Image();
  img1.src = "css/gfx/rock.jpg";
  img1.onload = function() {
    console.log("ROCK");
    var ctx = that._canvas1.getContext( '2d' );
    ctx.drawImage( img1, 0, 0, 256, 256 );
    updateTextures.call( that );
  };
  
  var img2 = new Image();
  img2.src = "css/gfx/sand.jpg";
  img2.onload = function() {
    console.log("SAND");
    var ctx = that._canvas2.getContext( '2d' );
    ctx.drawImage( img2, 0, 0, 256, 256 );
    updateTextures.call( that );
  };  
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
 * @see module:webgl.program

 */
});