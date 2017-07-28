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
