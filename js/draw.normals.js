/** @module draw.normals */require( 'draw.normals', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vert": "uniform mat4 uniTransfo;\r\nuniform mat3 uniCam3;\r\n\r\nattribute vec3 attPosition;\r\n\r\nvarying vec3 varPosition;\r\n\r\nvoid main() {\r\n  varPosition = attPosition;\r\n  vec4 pos = vec4(attPosition, 1);\r\n  gl_Position = uniTransfo * pos;\r\n}\r\n",
  "frag": "precision mediump float;\r\n\r\nvoid main() {\r\n  gl_FragColor = vec4(1, 0, 0, 1);\r\n}\r\n"};
  "use strict";

var Program = require( "webgl.program" );
var Controls = require("controls");


/**
 * @param {Object} opts.gl - Contexte WebGL.
 * @param  {Float32Array} opts.vert  -  Données pour  les vertex.  Les
 * attributs
 * @param  {number}   opts.stride  -  Nombre  d'éléments   du  tableau
 * Float32Array entre deux vertex successifs.
 * @param {number} opts.x - Offset contenant la coordonnée X.
 * @param {number} opts.y - Offset contenant la coordonnée Y.
 * @param {number} opts.z - Offset contenant la coordonnée Z.
 * @param  {number} opts.nx  -  Offset contenant  la  composante X  du
 * vecteur normal.
 * @param  {number} opts.ny  -  Offset contenant  la  composante Y  du
 * vecteur normal.
 * @param  {number} opts.nz  -  Offset contenant  la  composante Z  du
 * vecteur normal.
 * @param {number} opts.length - Taille du vecteur normal.
 */
function Normals( opts ) {
  if( typeof opts.x === 'undefined' ) opts.x = 0;
  if( typeof opts.y === 'undefined' ) opts.y = 1;
  if( typeof opts.z === 'undefined' ) opts.z = 2;
  if( typeof opts.nx === 'undefined' ) opts.nx = 3;
  if( typeof opts.ny === 'undefined' ) opts.ny = 4;
  if( typeof opts.nz === 'undefined' ) opts.nz = 5;
  if( typeof opts.length === 'undefined' ) opts.length = 1;
  if( typeof opts.stride === 'undefined' ) opts.stride = 9;
  
  var gl = opts.gl;
  var idxSrc = 0, idxDst = 0;
  var count = opts.vert.length / opts.stride;
  var vertSrc = opts.vert;
  var vertDst = new Float32Array( count * 6 );

  var x = opts.x;
  var y = opts.y;
  var z = opts.z;
  var nx = opts.nx;
  var ny = opts.ny;
  var nz = opts.nz;
  
  for( var n = 0 ; n < count ; n++ ) {
    vertDst[idxDst + 0] = vertSrc[idxSrc + x];
    vertDst[idxDst + 1] = vertSrc[idxSrc + y];
    vertDst[idxDst + 2] = vertSrc[idxSrc + z];
    vertDst[idxDst + 3] = vertSrc[idxSrc + x] + vertSrc[idxSrc + nx] * opts.length;
    vertDst[idxDst + 4] = vertSrc[idxSrc + y] + vertSrc[idxSrc + ny] * opts.length;
    vertDst[idxDst + 5] = vertSrc[idxSrc + z] + vertSrc[idxSrc + nz] * opts.length;

    idxSrc += opts.stride;
    idxDst += 6;
  }
  
  this._vertData = vertDst;
  this._vertBuff = gl.createBuffer();
  // Create program.
  this._prg = new Program( gl, {
    vert: GLOBAL.vert,
    frag: GLOBAL.frag
  } );
}


Normals.prototype.draw = function( world ) {
  if( Controls.Normal < 1 ) return;
  
  var gl = world.gl;
  var prg = this._prg;

  prg.use();
  prg.$uniTransfo = world.transfo;
  prg.$uniCam3 = world.cam3;

  // Bind attributes.
  prg.bindAttribs( this._vertBuff, "attPosition" );
  gl.bindBuffer( gl.ARRAY_BUFFER, this._vertBuff );
  gl.bufferData( gl.ARRAY_BUFFER, this._vertData, gl.STATIC_DRAW );

  // Draw.
  gl.drawArrays( gl.LINES, 0, this._vertData.length / 3 );  
};


module.exports = Normals;





  
module.exports._ = _;
/**
 * @module draw.normals
 * @see module:$
 * @see module:webgl.program
 * @see module:controls

 */
});