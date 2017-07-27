/** @module page.index */require( 'page.index', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

require("gfx");

var Draw = require("draw");
var Util = require("util");
var Terrain = require("draw.terrain");
var Normals = require("draw.normals");

var clamp = Util.clamp;

var GRID_SIZE = 16;

exports.start = function() {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  var gl = canvas.getContext('webgl', {
  });

  var draw = new Draw({
    gl: gl,
    camX: GRID_SIZE * 0.5, camY: GRID_SIZE * 0.5, camZ: 0,
    camR: 17, camLat: Math.PI * 0.4, camLng: 0
  });

  var terrainVert = createTerrainVert( GRID_SIZE );
  var terrainElem = createTerrainElem( GRID_SIZE );
  draw.addDrawer(
    new Terrain({ gl: gl, vert: terrainVert, elem: terrainElem }),
    new Normals({ gl: gl, vert: terrainVert })
  );
};



function createTerrainVert( gridsize ) {
  var n = gridsize + 1;
  var vert = new Float32Array( n * n * 9 );
  var idx = 0;
  var x, y, z = 0;
  var xc, yc;
  var xx, yy;
  var radius;

  var loop = 13;
  while( loop --> 0 ) {
    idx = 0;
    xc = Math.random() * n;
    yc = Math.random() * n;
    for( y = 0 ; y <= gridsize ; y++ ) {
      for( x = 0 ; x <= gridsize ; x++ ) {
        vert[idx + 0] = x;
        vert[idx + 1] = y;

        xx = x - xc;
        yy = y - yc;
        radius = 1.5 * 2 * Math.sqrt( xx*xx + yy*yy ) / n;
        if( radius < 1 ) {
          z = 1.2 * Math.cos( Math.PI * radius * 0.5);
        }
        vert[idx + 2] = (vert[idx + 2] + 3 * z) * 0.25;

        vert[idx + 3] = 0;
        vert[idx + 4] = 0;
        vert[idx + 5] = 1;
        vert[idx + 6] = 0;
        vert[idx + 7] = 1;
        vert[idx + 8] = 0;

        idx += 9;
      }
    }
  }

  var I = function( col, row ) {
    return 9 * (Math.floor(row) * n + Math.floor(col));
  };

  // Smooth
  loop = 0;
  while( loop --> 0 ) {
    for( y = 1 ; y < gridsize ; y++ ) {
      for( x = 1 ; x < gridsize ; x++ ) {
        idx = I( x, y );
        z = vert[idx + 2] * 4;
        idx = I( x + 1, y );
        z = vert[idx + 2];
        idx = I( x - 1, y );
        z = vert[idx + 2];
        idx = I( x, y - 1 );
        z = vert[idx + 2];
        idx = I( x, y + 1 );
        z = vert[idx + 2];
        vert[idx + 2] = z / 8;
      }
    }
  }

  for( y = 3 ; y < n - 3 ; y++ ) {
    for( x = n/3 ; x < n/3+3 ; x++ ) {
      idx = I( x, y );
      xc = x - n * 0.5;
      yc = y - n * 0.5;
      vert[idx + 2] += 2.2 + Math.random() * 0.5;
    }
  }

  for( y = 2 ; y < n - 2 ; y++ ) {
    for( x = n/3 - 1 ; x < n/3 + 4 ; x++ ) {
      idx = I( x, y );
      vert[idx + 2] += 0.5 + Math.random() * 0.5;
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
  for( y = 1 ; y < gridsize ; y++ ) {
    for( x = 1 ; x < gridsize ; x++ ) {
      idx = I( x, y );
      z = vert[idx + 2];

      vx = vy = vz = 0;

      vx1 = vert[idx + 9 + 0] - x;
      vy1 = vert[idx + 9 + 1] - y;
      vz1 = vert[idx + 9 + 2] - z;
      len = Math.sqrt(vx1*vx1 + vy1*vy1 + vz1*vz1);
      vx1 /= len;
      vy1 /= len;
      vz1 /= len;

      vx2 = vert[idx + 9*n + 0] - x;
      vy2 = vert[idx + 9*n + 1] - y;
      vz2 = vert[idx + 9*n + 2] - z;
      len = Math.sqrt(vx2*vx2 + vy2*vy2 + vz2*vz2);
      vx2 /= len;
      vy2 /= len;
      vz2 /= len;

      vx3 = vert[idx - 9 + 0] - x;
      vy3 = vert[idx - 9 + 1] - y;
      vz3 = vert[idx - 9 + 2] - z;
      len = Math.sqrt(vx3*vx3 + vy3*vy3 + vz3*vz3);
      vx3 /= len;
      vy3 /= len;
      vz3 /= len;

      vx4 = vert[idx - 9*n + 0] - x;
      vy4 = vert[idx - 9*n + 1] - y;
      vz4 = vert[idx - 9*n + 2] - z;
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

      Vx4 = vy4*vz1 - vz4*vy1;
      Vy4 = vx1*vz4 - vz1*vx4;
      Vz4 = vx4*vy1 - vy4*vx1;
      len = Math.sqrt(Vx4*Vx4 + Vy4*Vy4 + Vz4*Vz4);
      vx += Vx4 / len;
      vy += Vy4 / len;
      vz += Vz4 / len;

      // Vecteur normal.
      len = Math.sqrt(vx*vx + vy*vy + vz*vz);
      vert[idx + 3] = vx / len;
      vert[idx + 4] = vy / len;
      vert[idx + 5] = vz / len;
    }
  }

  return vert;
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


  
module.exports._ = _;
/**
 * @module page.index
 * @see module:$
 * @see module:gfx
 * @see module:draw
 * @see module:util
 * @see module:draw.terrain
 * @see module:draw.normals

 */
});