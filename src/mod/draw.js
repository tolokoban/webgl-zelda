"use strict";

var M = require( "webgl.math" ).m4;
var DB = require( "tfw.data-binding" );
var Util = require("util");
var Resize = require( "webgl.resize" );
var Controls = require("controls");


var clamp = Util.clamp;


function Draw( opts ) {
  var that = this;

  // A utiliser pour calculer les FPS.
  this._lastTime = 0;
  this._framesCount = 0;
  
  // On crée  les matrices  nécessaires à la  caméra et  la projection
  // pour éviter les allocations mémoire pendant l'animation.
  this._matCamera3 = new Float32Array( 9 );
  this._matCamera = M.matrix();
  this._matPerspective = M.matrix();
  this._matTransfo = M.matrix();

  var rendering = false;
  var r = render.bind( this );
  var lastTime = -1;
  var anim = function( time ) {
    if( lastTime < 0 ) {
      lastTime = time;
    }
    r( time, time - lastTime );
    lastTime = time;
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
  DB.propFloat( this, 'fps' );
  DB.prop( this, 'gl' );
  
  DB.extend( {
    play: true,
    fps: 60,
    camX: 0, camY: 0, camZ: 0,
    camR: 10, camLat: Math.PI * 0.33, camLng: 0,
    gl: null
  }, opts, this );
  
  this._drawers = [];
  this._world = { gl: this.gl };

  requestAnimationFrame( anim );  
}


function render( time, delta ) {
  // Calcul des FPS.
  this._framesCount++;
  if (this._framesCount >= 15) {
    this.fps = Math.floor( 0.5 + 15000 / (time - this._lastTime) );
    this._framesCount = 0;
    this._lastTime = time;
  }

  var world = this._world;
  world.time = time;
  world.delta = delta;
  var gl = world.gl;
  
  Resize( gl, 1 );

  var speed = delta * .01;
  this.camX += speed * (Controls.East - Controls.West);
  this.camX = clamp( this.camX, 0, 255 + 8 );
  this.camY += speed * (Controls.North - Controls.South);
  this.camY = clamp( this.camY, 0, 255 + 8 );

  var x = this.camX;
  world.camX = x;
  var y = this.camY;
  world.camY = y;
  var z = this.camZ;
  world.camZ = z;
  var r = this.camR;

  // Utiliser les touches pour déplacer la vue.
  speed = delta * .0009;
  
  this.camLat += speed * (Controls.Up - Controls.Down);
  this.camLat = clamp( this.camLat, 0, Math.PI * 0.5 );
  
  var lat = this.camLat;
  var lng = this.camLng;
  var camera = M.cameraPolar(
    x, y, z,
    r, lat, lng,
    this._matCamera
  );
  var perspective = M.perspective(
    Math.PI * 0.3,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.01, 30,
    this._matPerspective
  );
  var transfo = M.mul( perspective, camera, this._matTransfo );
  world.transfo = transfo;
  world.camera = camera;

  gl.clearColor( 0.2, 0.6, 1.0, 1.0 );
  gl.clear( gl.COLOR_BUFFER_BIT );
  // Backface culling.
  gl.disable( gl.CULL_FACE );
  gl.cullFace( gl.FRONT );
  // Near things obscure far things.
  gl.clearDepth( 1.0 );
  gl.enable( gl.DEPTH_TEST );
  gl.depthFunc( gl.LEQUAL );

  this._drawers.forEach(function (drawer) {
    drawer.draw( world );
  });
}


/**
 * @param {array} drawers... - Drawers to add.
 */
Draw.prototype.addDrawer = function() {
  for( var i = 0 ; i < arguments.length ; i++ ) {
    this._drawers.push( arguments[i] );    
  }
};


module.exports = Draw;
