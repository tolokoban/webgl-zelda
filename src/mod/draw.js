"use strict";

var M = require( "webgl.math" ).m4;
var DB = require( "tfw.data-binding" );
var Resize = require( "webgl.resize" );
var Util = require("util");

var clamp = Util.clamp;


function Draw( opts ) {
  var that = this;

  // Creating matrix now to prevent memory allocation during animation.
  this._matCamera3 = new Float32Array( 9 );
  this._matCamera = M.matrix();
  this._matPerspective = M.matrix();
  this._matTransfo = M.matrix();

  var rendering = false;
  var r = render.bind( this );
  var anim = function( time ) {
    r( time );
    if( rendering ) {
      requestAnimationFrame( anim );
    }
  };

  DB.propBoolean( this, 'play' )(function(v) {
    rendering = v;
  });
  DB.propFloat( this, 'camX' );
  DB.propFloat( this, 'camY' );
  DB.propFloat( this, 'camZ' );
  DB.propFloat( this, 'camR' );
  DB.propFloat( this, 'camA' );
  DB.prop( this, 'gl' );
  
  DB.extend( {
    play: true,
    camX: 0, camY: 0, camZ: 0,
    camR: 10, camLat: Math.PI * 0.33, camLng: 0,
    gl: null
  }, opts, this );
  
  this._drawers = [];
  this._world = { gl: this.gl };

  requestAnimationFrame( anim );  
}


function render( time ) {
  var world = this._world;
  var gl = world.gl;
  
  Resize( gl, 1 );

  var x = this.camX;
  var y = this.camY;
  var z = this.camZ;
  var r = this.camR;
  var lat = this.camLat;
  var lng = this.camLng;
  var camera = M.cameraPolar(
    x, y, z,
    r, lat, lng,
    this._matCamera
  );
  var cam3 = this._matCamera3;
  cam3[ 0 ] = camera[ 0 ];
  cam3[ 1 ] = camera[ 1 ];
  cam3[ 2 ] = camera[ 2 ];
  cam3[ 3 ] = camera[ 4 ];
  cam3[ 4 ] = camera[ 5 ];
  cam3[ 5 ] = camera[ 6 ];
  cam3[ 6 ] = camera[ 8 ];
  cam3[ 7 ] = camera[ 9 ];
  cam3[ 8 ] = camera[ 10 ];
  var perspective = M.perspective(
    Math.PI * 0.3,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.001, 3,
    this._matPerspective
  );
  var transfo = M.mul( perspective, camera, this._matTransfo );
  world.transfo = transfo;
  world.cam3 = cam3;

  gl.clearColor( 0.2, 0.6, 1.0, 1.0 );
  gl.clear( gl.COLOR_BUFFER_BIT );
  // Backface culling.
  gl.enable( gl.CULL_FACE );
  gl.cullFace( gl.FRONT );
  // Near things obscure far things.
  gl.clearDepth( 1.0 );
  gl.enable( gl.DEPTH_TEST );
  gl.depthFunc( gl.LEQUAL );

  this._drawers.forEach(function (drawer) {
    drawer.draw( time, world );
  });
}


Draw.prototype.addDrawer = function( drawer ) {
  this._drawers.push( drawer );
};


module.exports = Draw;
