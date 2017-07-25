"use strict";

var Draw = require("draw");
var Terrain = require("draw.terrain");


exports.start = function() {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  var gl = canvas.getContext('webgl', {
  });

  var draw = new Draw({
    gl: gl
  });

  draw.addDrawer( createTerrain( gl ) );
};



function createTerrain( gl ) {
  var gridSize = 5;
  var elem = createTerrainElem( gridSize );
  var vert = new Float32Array( (gridSize + 1) * (gridSize + 1) * 9 );
  var idx = 0;
  var x, y, z = 0;
  for( y = 0 ; y <= gridSize ; y++ ) {
    for( x = 0 ; x <= gridSize ; x++ ) {
      vert[idx + 0] = x;
      vert[idx + 1] = y;
      vert[idx + 2] = z;
      vert[idx + 3] = 0;
      vert[idx + 4] = 0;
      vert[idx + 5] = 1;
      vert[idx + 6] = 0;
      vert[idx + 7] = 1;
      vert[idx + 8] = 0;

      idx += 9;
    }
  }

  return new Terrain({ gl: gl, vert: vert, elem: elem });
}


/**
 * Because we will use `drawElement` and `TRIANGLE_STRIP`, we need to order indexes.
 * We will walk through the plateau in boustrophedon mode.
 */
function createTerrainElem( gridSize ) {
  var data = [ 0 ];
  // `gridSize` is the number of cells, `n` is the number of vertex.
  var n = gridSize + 1;
  var I = function ( r, c ) {
    return n * r + c;
  };
  var row, col;
  for ( row = 0; row < gridSize; row++ ) {
    for ( col = 0; col < gridSize; col++ ) {
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
    if ( row >= gridSize ) break;
    for ( col = gridSize; col > 0; col-- ) {
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
