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
  // Create program.
  this._prg = new Program( gl, {
    vert: GLOBAL.vert,
    frag: GLOBAL.frag
  } );
}


Terrain.prototype.draw = function( world ) {
  var gl = world.gl;
  var prg = this._prg;

  prg.use();
  prg.$uniTransfo = world.transfo;
  prg.$uniCamera = world.camera;

  if( !this._debug ) {
    this._debug = true;
    console.info("[draw.terrain] world=", world);
    var data = this._vertData;
    var v = new Float32Array( 4 );
    v[0] = data[0];
    v[1] = data[1];
    v[2] = data[2];
    v[3] = 1;
    console.log( M.mul( world.transfo, v) );
    v[0] = data[0 + 9];
    v[1] = data[1 + 9];
    v[2] = data[2 + 9];
    v[3] = 1;
    console.log( M.mul( world.transfo, v) );
    v[0] = data[0 + 18];
    v[1] = data[1 + 18];
    v[2] = data[2 + 18];
    v[3] = 1;
    console.log( M.mul( world.transfo, v) );
  }
  
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



