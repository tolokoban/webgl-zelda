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
