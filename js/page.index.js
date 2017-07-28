/** @module page.index */require( 'page.index', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

require("gfx");
require("font.mystery-quest");

var $ = require("dom");
var W = require("x-widget").getById;
var DB = require("tfw.data-binding");
var Draw = require("draw");
var Util = require("util");
var Terrain = require("terrain");
var DrawTerrain = require("draw.terrain");
var DrawNormals = require("draw.normals");

var clamp = Util.clamp;

var GRID_SIZE = 20;

var G = {};

exports.start = function() {
  var canvas = document.getElementById('canvas');
  var gl = canvas.getContext('webgl', {
    antialias: false
  });

  var terrain = new Terrain({
    width: 80, height: 50
  });
  W('mini-map').terrain = terrain;

  var draw = new Draw({
    gl: gl,
    camX: terrain.width / 2,
    camY: terrain.height / 2,
    camZ: 0,
    camR: 16, camLat: Util.rad( 60 ), camLng: 0
  });

  var fps = $('fps');
  DB.bind( draw, 'fps', function(v) {
    fps.textContent = v;
  });

  var drawTerrain = new DrawTerrain({ gl: gl, terrain: terrain });
  draw.addDrawer(
    drawTerrain,
    new DrawNormals({ gl: gl, vert: terrain.vert })
  );

  G.miniMap = W("mini-map");
  G.terrain = terrain;
  G.drawTerrain = drawTerrain;
};


exports.onUnselect = function() {
  G.miniMap.clearSelection();
};


var BRUSHES = {
  sea: {
    source: 0,
    min: -2.1,
    max: -1.9
  },
  beach: {
    source: 0,
    min: 0,
    max: 1.5
  },
  up: {
    source: 1,
    min: 0.45,
    max: 0.55
  },
  down: {
    source: 1,
    min: -0.55,
    max: -0.45
  }
}

exports.onBrush = function( id ) {
  if( id === 'smooth' ) {
    smooth();
    return;
  }

  var brush = BRUSHES[id];
  if( !brush ) return;

  var selection = G.miniMap.getSelection();
  var vert = G.terrain.vert;
  var idxA = 2, idxB = 3;
  var z, alpha;
  var loops = selection.length >> 2;

  while( loops --> 0 ) {
    alpha = selection[idxB] / 255;
    if( alpha > 0 ) {
      z = vert[idxA] * brush.source;
      z += alpha * (brush.min + Math.random() * (brush.max - brush.min));
      vert[idxA] = z;
    }
    idxA += G.terrain.STRIDE;
    idxB += 4;
  }

  G.terrain.computeNormals();
  G.miniMap.update();
};


function smooth() {
  var selection = G.miniMap.getSelection();
  var idxB = 3, idx = 0, indexes = [];
  var loops = selection.length >> 2;

  while( loops --> 0 ) {
    if( selection[idxB] > 0 ) {
      indexes.push( idx );
    }
    idxB += 4;
    idx++;
  }

  G.terrain.smooth( 1, indexes );
  G.miniMap.update();  
}


  
module.exports._ = _;
/**
 * @module page.index
 * @see module:$
 * @see module:gfx
 * @see module:font.mystery-quest
 * @see module:dom
 * @see module:x-widget
 * @see module:tfw.data-binding
 * @see module:draw
 * @see module:util
 * @see module:terrain
 * @see module:draw.terrain
 * @see module:draw.normals

 */
});