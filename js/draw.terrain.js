/** @module draw.terrain */require( 'draw.terrain', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vert": "uniform mat4 uniTransfo;\r\nuniform mat4 uniCamera;\r\n\r\nattribute vec3 attPosition;\r\nattribute vec3 attNormal;\r\nattribute vec3 attColor;\r\n\r\nvarying vec3 varPosition;\r\nvarying vec3 varNormal;\r\nvarying vec3 varCamera;\r\nvarying vec2 varUV;\r\nvarying float varSlope;\r\n\r\nvarying vec3 varColor;\r\n\r\nvoid main() {\r\n  vec4 pos = vec4(attPosition, 1);\r\n\r\n  varPosition = attPosition;\r\n  varNormal = mat3(uniCamera) * attNormal;\r\n  varCamera = -normalize(uniCamera * pos).xyz;\r\n  varSlope = (1.0 - attNormal.z);\r\n  varSlope *= varSlope;\r\n  varUV = attPosition.xy * 0.3;\r\n                         \r\n  gl_Position = uniTransfo * pos;\r\n\r\n  varColor = attColor;\r\n}\r\n",
  "frag": "precision mediump float;\r\n\r\nvarying vec3 varPosition;\r\nvarying vec3 varNormal;\r\nvarying vec3 varCamera;\r\nvarying vec2 varUV;\r\nvarying float varSlope;\r\n\r\nvarying vec3 varColor;\r\n\r\n// Textures.\r\nuniform sampler2D tex0;\r\nuniform sampler2D tex1;\r\n\r\n\r\nvoid main() {\r\n  vec3 c0 = texture2D(tex0, varUV).rgb;\r\n  vec3 c1 = texture2D(tex1, varUV).rgb;\r\n  float k = varSlope * 10.0 - 1.0;\r\n  k = clamp( k + 0.5, 0.0, 1.0 );\r\n  vec3 color = mix(c0, c1, k);\r\n\r\n  vec3 normal = normalize(varNormal);\r\n  vec3 camera = normalize(varCamera);\r\n  float dir = dot(normal, camera);  \r\n  dir = clamp(dir, 0.0, 1.0);  \r\n  color = mix(vec3(0,0,0), color, dir);\r\n  if( dir < .4 ) {\r\n    color = mix(vec3(1,1,1), color, dir * 2.0 + .2);    \r\n  }\r\n\r\n  gl_FragColor = vec4(color, 1);\r\n}\r\n"};
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
  
  // Bind attributes.
  prg.bindAttribs( this._vertBuff, "attPosition", "attNormal", "attColor" );
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

  updateTextures.call( this );

  var img0 = new Image();
  img0.src = "css/gfx/grass.jpg";
  img0.onload = function() {
    var ctx = that._canvas0.getContext( '2d' );
    ctx.drawImage( img0, 0, 0, 256, 256 );
    updateTextures.call( that );
  };
  
  var img1 = new Image();
  img1.src = "css/gfx/rock.jpg";
  img1.onload = function() {
    var ctx = that._canvas1.getContext( '2d' );
    ctx.drawImage( img1, 0, 0, 256, 256 );
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
}


  
module.exports._ = _;
/**
 * @module draw.terrain
 * @see module:$
 * @see module:webgl.math
 * @see module:webgl.program

 */
});