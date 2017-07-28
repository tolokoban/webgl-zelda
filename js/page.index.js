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

<<<<<<< HEAD
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
=======
  var terrainVert = createTerrainVert( GRID_SIZE );
  var terrainElem = createTerrainElem( GRID_SIZE );
  var terrain = new Terrain();

  var draw = new Draw({
    gl: gl,
    camX: 64, camY: 64, camZ: 0,
    camR: 16, camLat: Math.PI * 0.4, camLng: 0
  });

  draw.addDrawer(
    new DrawTerrain({ gl: gl, terrain: terrain, vert: terrainVert, elem: terrainElem }),
    new DrawNormals({ gl: gl, vert: terrainVert })
  );
};



function createTerrainVert( gridsize ) {
  var n = gridsize + 1;
  var vert = new Float32Array( n * n * 6 );
  var idx = 0;
  var x, y, z = 0;
  var xc, yc;
  var xx, yy;
  var radius;

  var loop = 20;
  while( loop --> 0 ) {
    idx = 0;
    xc = Math.random() * n;
    yc = Math.random() * n;
    for( y = 0 ; y <= gridsize ; y++ ) {
      for( x = 0 ; x <= gridsize ; x++ ) {
        vert[idx + 0] = x + (Math.random() - 0.5) * 0.3;
        vert[idx + 1] = y + (Math.random() - 0.5) * 0.3;

        xx = x - xc;
        yy = y - yc;
        radius = 1.5 * 2 * Math.sqrt( xx*xx + yy*yy ) / n;
        if( radius < 1 ) {
          z = 1.8 * Math.cos( Math.PI * radius * 0.5);
        }
        vert[idx + 2] = (vert[idx + 2] + 3 * z) * 0.25;

        vert[idx + 3] = 0;
        vert[idx + 4] = 0;
        vert[idx + 5] = 1;

        idx += 6;
      }
    }
  }

  var I = function( col, row ) {
    return 6 * (Math.floor(row) * n + Math.floor(col));
  };
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877


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

<<<<<<< HEAD
  G.terrain.computeNormals();
  G.miniMap.update();
};
=======
  var vx1, vy1, vz1;
  var vx2, vy2, vz2;
  var vx3, vy3, vz3;
  var vx4, vy4, vz4;
  var Vx1, Vy1, Vz1;
  var Vx2, Vy2, Vz2;
  var Vx3, Vy3, Vz3;
  var Vx4, Vy4, Vz4;
  var len;
  var vx = 0, vy = 0, vz = 0;
  for( y = 1 ; y < gridsize ; y++ ) {
    for( x = 1 ; x < gridsize ; x++ ) {
      idx = I( x, y );
      z = vert[idx + 2];

      vx = vy = vz = 0;

      vx1 = vert[idx + 6 + 0] - x;
      vy1 = vert[idx + 6 + 1] - y;
      vz1 = vert[idx + 6 + 2] - z;
      len = Math.sqrt(vx1*vx1 + vy1*vy1 + vz1*vz1);
      vx1 /= len;
      vy1 /= len;
      vz1 /= len;

      vx2 = vert[idx + 6*n + 0] - x;
      vy2 = vert[idx + 6*n + 1] - y;
      vz2 = vert[idx + 6*n + 2] - z;
      len = Math.sqrt(vx2*vx2 + vy2*vy2 + vz2*vz2);
      vx2 /= len;
      vy2 /= len;
      vz2 /= len;

      vx3 = vert[idx - 6 + 0] - x;
      vy3 = vert[idx - 6 + 1] - y;
      vz3 = vert[idx - 6 + 2] - z;
      len = Math.sqrt(vx3*vx3 + vy3*vy3 + vz3*vz3);
      vx3 /= len;
      vy3 /= len;
      vz3 /= len;

      vx4 = vert[idx - 6*n + 0] - x;
      vy4 = vert[idx - 6*n + 1] - y;
      vz4 = vert[idx - 6*n + 2] - z;
      len = Math.sqrt(vx4*vx4 + vy4*vy4 + vz4*vz4);
      vx4 /= len;
      vy4 /= len;
      vz4 /= len;

      // Produits vectoriels.
      Vx1 = vy1*vz2 - vz1*vy2;
      Vy1 = vx2*vz1 - vz2*vy1;
      Vz1 = vx1*vy2 - vy1*vx2;
      len = Math.sqrt(Vx1*Vx1 + Vy1*Vy1 + Vz1*Vz1);
      vx += Vx1 / len;
      vy += Vy1 / len;
      vz += Vz1 / len;

      Vx2 = vy2*vz3 - vz2*vy3;
      Vy2 = vx3*vz2 - vz3*vy2;
      Vz2 = vx2*vy3 - vy2*vx3;
      len = Math.sqrt(Vx2*Vx2 + Vy2*Vy2 + Vz2*Vz2);
      vx += Vx2 / len;
      vy += Vy2 / len;
      vz += Vz2 / len;

      Vx3 = vy3*vz4 - vz3*vy4;
      Vy3 = vx4*vz3 - vz4*vy3;
      Vz3 = vx3*vy4 - vy3*vx4;
      len = Math.sqrt(Vx3*Vx3 + Vy3*Vy3 + Vz3*Vz3);
      vx += Vx3 / len;
      vy += Vy3 / len;
      vz += Vz3 / len;
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877


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