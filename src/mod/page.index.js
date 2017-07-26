"use strict";

var Draw = require("draw");
var Terrain = require("draw.terrain");

var GRID_SIZE = 20;

exports.start = function() {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  var gl = canvas.getContext('webgl', {
  });

  var draw = new Draw({
    gl: gl,
    camX: GRID_SIZE * 0.5, camY: GRID_SIZE * 0.5, camZ: 0,
    camR: 10, camLat: Math.PI * 0.4, camLng: 0
  });

  draw.addDrawer( createTerrain( gl ) );
};



function createTerrain( gl ) {
  var n = GRID_SIZE + 1;
  var elem = createTerrainElem( GRID_SIZE );
  var vert = new Float32Array( n * n * 9 );
  var idx = 0;
  var x, y, z = 0;
  for( y = 0 ; y <= GRID_SIZE ; y++ ) {
    for( x = 0 ; x <= GRID_SIZE ; x++ ) {
      vert[idx + 0] = x;
      vert[idx + 1] = y;
      vert[idx + 2] = (x > 0 && x < GRID_SIZE) || (y > 0 && y < GRID_SIZE) ? Math.random() * 2 : 0;
      vert[idx + 3] = 0;
      vert[idx + 4] = 0;
      vert[idx + 5] = 1;
      vert[idx + 6] = 0;
      vert[idx + 7] = 1;
      vert[idx + 8] = 0;

      idx += 9;
    }
  }

  var I = function( col, row ) {
    return 9 * (row * n + col);
  };

  for( y = 1 ; y < GRID_SIZE ; y++ ) {
    for( x = 1 ; x < GRID_SIZE ; x++ ) {
      idx = I( x, y );
      
    }
  }

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
  for( y = 1 ; y < GRID_SIZE ; y++ ) {
    for( x = 1 ; x < GRID_SIZE ; x++ ) {
      idx = I( x, y );
      z = vert[idx + 2];

      vx = vy = vz = 0;

      vx1 = vert[idx + 9 + 0] - x;
      vy1 = vert[idx + 9 + 1] - y;
      vz1 = vert[idx + 9 + 2] - z;
      len = vx1*vx1 + vy1*vy1 + vz1*vz1;
      vx1 /= len;
      vy1 /= len;
      vz1 /= len;

      vx2 = vert[idx + 9*n + 0] - x;
      vy2 = vert[idx + 9*n + 1] - y;
      vz2 = vert[idx + 9*n + 2] - z;
      len = vx2*vx2 + vy2*vy2 + vz2*vz2;
      vx2 /= len;
      vy2 /= len;
      vz2 /= len;

      vx3 = vert[idx - 9 + 0] - x;
      vy3 = vert[idx - 9 + 3] - y;
      vz3 = vert[idx - 9 + 2] - z;
      len = vx3*vx3 + vy3*vy3 + vz3*vz3;
      vx3 /= len;
      vy3 /= len;
      vz3 /= len;

      vx4 = vert[idx - 9*n + 0] - x;
      vy4 = vert[idx - 9*n + 1] - y;
      vz4 = vert[idx - 9*n + 4] - z;
      len = vx4*vx4 + vy4*vy4 + vz4*vz4;
      vx4 /= len;
      vy4 /= len;
      vz4 /= len;

      // Produits vectoriels.
      

      len = vx*vx + vy*vy + vz*vz;
      vert[idx + 3] = vx / len;
      vert[idx + 4] = vy / len;
      vert[idx + 5] = vz / len;
    }
  }

  return new Terrain({
    gl: gl, vert: vert, elem: elem
  });
}


/**
 * Because we will use `drawElement` and `TRIANGLE_STRIP`, we need to order indexes.
 * We will walk through the plateau in boustrophedon mode.
 */
function createTerrainElem( gridsize ) {
  var data = [ 0 ];
  // `gridsize` is the number of cells, `n` is the number of vertex.
  var n = gridsize + 1;
  var I = function ( r, c ) {
    return n * r + c;
  };
  var row, col;
  for ( row = 0; row < gridsize; row++ ) {
    for ( col = 0; col < gridsize; col++ ) {
      // 0---B---D
      // +  /+  /+
      // + / + / +
      // +/  +/  +
      // A---C---+
      // Let push A, then B, then C, then D, ...
      data.push(
        I( row + 1, col ),
        I( row, col + 1 )
      );
    }
    data.push( I( row + 1, n - 1 ) );
    // If there is a row left, let's go backward.
    row++;
    if ( row >= gridsize ) break;
    for ( col = gridsize; col > 0; col-- ) {
      // D---B---0
      // +\  +\  +
      // + \ + \ +
      // +  \+  \+
      // +---C---A
      // Let push A, then B, then C, then D, ...
      data.push(
        I( row + 1, col ),
        I( row, col - 1 )
      );
    }
    data.push( I( row + 1, 0 ) );
  }

  return new Uint16Array( data );
}
