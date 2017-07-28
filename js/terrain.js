/** @module terrain */require( 'terrain', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    /**
 * Le terrain est une grille qui peut être plus grande que l'écran.
 * Cette classe permet de n'afficher que la partie visible en stoquant
 * tous les vertex  dans la carte graphique, mais en  ne dessinant que
 * ceux fournis par un tableau d'index qui dépend de la position de la
 * caméra.
 */
"use strict";

var Util = require("util");
<<<<<<< HEAD
var Controls = require("controls");
=======
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877

var STRIDE = 6;

function Terrain(opts) {
  if( typeof opts === 'undefined' ) opts = {};
<<<<<<< HEAD
  if( typeof opts.width === 'undefined' ) opts.width = 64;
  if( typeof opts.height === 'undefined' ) opts.height = 64;
  if( typeof opts.viewW === 'undefined' ) opts.viewW = 40;
  if( typeof opts.viewH === 'undefined' ) opts.viewH = 30;
=======
  if( typeof opts.width === 'undefined' ) opts.width = 256;
  if( typeof opts.height === 'undefined' ) opts.height = 256;
  if( typeof opts.viewW === 'undefined' ) opts.viewW = 30;
  if( typeof opts.viewH === 'undefined' ) opts.viewH = 50;
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877

  this._opts = opts;

  var w = opts.width;
  var h = opts.height;
  Util.propReadOnly(this, {
<<<<<<< HEAD
    width: w, height: h, STRIDE: STRIDE
=======
    width: w, height: h
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
  });

  this.index = function( x, y ) {
    x = Math.floor( 0.5 + x + w) % w;
    y = Math.floor( 0.5 + y + h) % h;
    return y * w + x;
  };

  this.coords = function( idx ) {
    var col = idx % w;
    var row = Math.floor( (idx - col) / w );
    return [col, row];
  };

  this._W = w;
  this._H = h;
  // Liste des index de tous les points du terrain.
  this._indexes = [];
  for( var i = 0 ; i < w * h ; i++ ) this._indexes.push( i );

  if( typeof opts.vert === 'undefined' || opts.vert.length !== w * h * STRIDE ) {
    this.vert = new Float32Array( w * h * STRIDE );
    snapToGrid.call( this );
    addNoise.call( this, -10, 14 );
<<<<<<< HEAD
    Terrain.prototype.smooth.call( this );
  } else {
    this.vert = opts.vert;
  }
  setBorder.call( this );
  Terrain.prototype.computeNormals.call( this );

  var grid = createElems.call( this, w, h, opts.viewW, opts.viewH );
  this.getElems = function( x, y ) {
    y += opts.viewH * 0.1;
    var col = Util.clamp( Math.floor( x / grid.shiftX ), 0, grid.cols - 1 );
    var row = Util.clamp( Math.floor( y / grid.shiftY ), 0, grid.rows - 1 );
    var idx = row * grid.cols + col;
    if( Controls.Debug ) {
      console.info("[terrain] x, y, col, row=", x, y, col, row);
    }
=======
    smooth.call( this );
  } else {
    this.vert = opts.vert;
  }
  computeNormals.call( this );

  var grid = createElems.call( this, w, h, opts.viewW, opts.viewH );
  this.getElems = function( x, y ) {
    x -= grid.cornerX + grid.halfVW * 0.5;
    if( x < 0 ) x = 0;
    y -= grid.cornerY + grid.halfVH * 0.5;
    if( y < 0 ) y = 0;

    var col = Util.clamp( Math.floor( x / grid.halfVW ), 0, grid.cols - 1 );
    var row = Util.clamp( Math.floor( y / grid.halfVH ), 0, grid.rows - 1 );
    var idx = row * grid.cols + col;
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
    return grid.elems[idx];
  };
}

module.exports = Terrain;


/**
 * @member Terrain.addNoise
 * @param {number} min - Valeur minimale de mètres à ajouter à l'altitude.
 * @param {number} max - Valeur maximale de mètres à ajouter à l'altitude.
 * @param {array} indexes - Les  index des points sur lesquels ajouter
 * du bruit. Si non défini, on ajoute du bruit sur tout le terrain.
 */
Terrain.prototype.addNoise = addNoise;
var addNoise = function( min, max, indexes ) {
  if( !Array.isArray( indexes ) ) {
    var idx = 0;
    while( idx < this.vert.length ) {
      this.vert[idx + 2] += Math.random() * ( max - min ) + min;
      idx += STRIDE;
    }
  } else {
    var k;
    for( k = 0 ; k < indexes.length ; k++ ) {
      var i = indexes[k] * STRIDE;
      this.vert[i + 2] += Math.random() * ( max - min ) + min;
    }
  }
};

Terrain.prototype.snapToGrid = snapToGrid;
var snapToGrid = function( indexes ) {
  if( !Array.isArray( indexes ) ) indexes = this._indexes;

  var idx, coords, col, row;
  for( var k = 0 ; k < indexes.length ; k++ ) {
    idx = indexes[k];
    coords = this.coords( idx );
    col = coords[0], row = coords[1];
    
    idx *= STRIDE;
    this.vert[idx + 0] = col;
    this.vert[idx + 1] = row;    
  }
};

<<<<<<< HEAD
Terrain.prototype.smooth = function( loops, indexes ) {
=======
Terrain.prototype.smooth = smooth;
var smooth = function( loops, indexes ) {
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
  if( typeof loops !== 'number' ) loops = 2;
  if( !Array.isArray( indexes ) ) indexes = this._indexes;

  while( loops --> 0 ) {
    var result = new Float32Array( indexes.length );
    var vert = this.vert;
    indexes.forEach(function (idx, j) {
      var coords = this.coords( idx );
      var col = coords[0], row = coords[1];
      var z = 4 * vert[ 2 + STRIDE * idx ];
      z += 2 * vert[ 2 + STRIDE * this.index( col + 1, row ) ];
      z += 2 * vert[ 2 + STRIDE * this.index( col - 1, row ) ];
      z += 2 * vert[ 2 + STRIDE * this.index( col, row + 1 ) ];
      z += 2 * vert[ 2 + STRIDE * this.index( col, row - 1 ) ];
      z += vert[ 2 + STRIDE * this.index( col + 1, row + 1) ];
      z += vert[ 2 + STRIDE * this.index( col - 1, row - 1) ];
      z += vert[ 2 + STRIDE * this.index( col - 1, row + 1 ) ];
      z += vert[ 2 + STRIDE * this.index( col + 1, row - 1 ) ];
      z *= 0.0625;   // Diviser par 16.
      result[j] = z;
    }, this);

    result.forEach(function (z, k) {
      var idx = indexes[k] * STRIDE;
      vert[idx + 2] = z;
    });
  }
};

<<<<<<< HEAD
Terrain.prototype.computeNormals = function( indexes ) {
=======
Terrain.prototype.computeNormals = computeNormals;
var computeNormals = function( indexes ) {
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
  if( !Array.isArray( indexes ) ) indexes = this._indexes;

  var k, idx, col, row, coords;
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
  var x, y, z;
  var vert = this.vert;

  for( k = 0 ; k < indexes.length ; k++ ) {
    idx = indexes[k];
    coords = this.coords( idx );
    col = coords[0], row = coords[1];

    idx *= STRIDE;
    x = vert[idx + 0];
    y = vert[idx + 1];
    z = vert[idx + 2];

    vx = vy = vz = 0;

    idx = STRIDE * this.index( col + 1, row );
    vx1 = vert[idx + 0] - x;
    vy1 = vert[idx + 1] - y;
    vz1 = vert[idx + 2] - z;
    len = Math.sqrt(vx1*vx1 + vy1*vy1 + vz1*vz1);
    vx1 /= len;
    vy1 /= len;
    vz1 /= len;

    idx = STRIDE * this.index( col, row + 1 );
    vx2 = vert[idx + 0] - x;
    vy2 = vert[idx + 1] - y;
    vz2 = vert[idx + 2] - z;
    len = Math.sqrt(vx2*vx2 + vy2*vy2 + vz2*vz2);
    vx2 /= len;
    vy2 /= len;
    vz2 /= len;

    idx = STRIDE * this.index( col - 1, row );
    vx3 = vert[idx + 0] - x;
    vy3 = vert[idx + 1] - y;
    vz3 = vert[idx + 2] - z;
    len = Math.sqrt(vx3*vx3 + vy3*vy3 + vz3*vz3);
    vx3 /= len;
    vy3 /= len;
    vz3 /= len;

    idx = STRIDE * this.index( col, row - 1 );
    vx4 = vert[idx + 0] - x;
    vy4 = vert[idx + 1] - y;
    vz4 = vert[idx + 2] - z;
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
    idx = STRIDE * indexes[k];
    len = Math.sqrt(vx*vx + vy*vy + vz*vz);
    vert[idx + 3] = vx / len;
    vert[idx + 4] = vy / len;
    vert[idx + 5] = vz / len;
<<<<<<< HEAD
  }
};

/**
 * Force les altitudes à -2 sur le carré extérieur.
 */
function setBorder() {
  var idxA = 0;
  var idxB = STRIDE * this.index( 0, this.height - 1 );
  var loops = this.width;
  while( loops --> 0 ) {
    this.vert[idxA + 2] = -2;
    this.vert[idxB + 2] = -2;
    idxA += STRIDE;
    idxB += STRIDE;
  }

  var offset = STRIDE * this.width;
  idxA = offset;
  idxB = STRIDE * this.index( this.width - 1, 1 );
  
  loops = this.heigh - 2;
  while( loops --> 0 ) {
    this.vert[idxA + 2] = -2;
    this.vert[idxB + 2] = -2;
    idxA += offset;
    idxB += offset;
  }
}

/**
 * @param {number} terrainW - Nombre de vertex dans la largeur du terrain.
 * @param {number} terrainH - Nombre de vertex dans la hauteur du terrain.
 * @param {number} viewW - Nombre de vertex dans la largeur de l'espace visible.
 * @param {number} viewH - Nombre de vertex dans la hauteur de l'espace visible.
 */
function createElems( terrainW, terrainH, viewW, viewH ) {
  var shiftX = 8;
  var shiftY = 8;
  
  var halfViewW = viewW >> 1;
  var cols = Math.ceil( terrainW / shiftX );
  var cornerX = (shiftX >> 1) - halfViewW;
  var halfViewH = viewH >> 1;
  var rows = Math.ceil( terrainH / shiftY );
  var cornerY = (shiftY >> 1) - halfViewH;

  var elems = [];
  var col, row, x, y;
  for( row = 0 ; row < rows ; row++ ) {
    for( col = 0 ; col < cols ; col++ ) {
      x = cornerX + col * shiftX;
      y = cornerY + row * shiftY;
      elems.push(
        boustrophedon.call(
          this, x, y, viewW, viewH, terrainW, terrainH
=======

    // DEBUG.
/*
    vert[idx + 3] = 0;
    vert[idx + 4] = 0;
    vert[idx + 5] = 1;
*/
  }
};


/**
 * @param {number} TW - Nombre de vertex dans la largeur du terrain.
 * @param {number} TH - Nombre de vertex dans la hauteur du terrain.
 * @param {number} VW - Nombre de vertex dans la largeur de l'espace visible.
 * @param {number} VH - Nombre de vertex dans la hauteur de l'espace visible.
 */
function createElems( TW, TH, VW, VH ) {
  var halfVW = Math.ceil( VW * 0.5 );
  var cols = Math.ceil( TW / halfVW );
  var cornerX = TW - halfVW * cols;
  var halfVH = Math.ceil( VH * 0.5 );
  var rows = Math.ceil( TH / halfVH );
  var cornerY = TH - halfVH * rows;

  var elems = [];
  var col, row;
  for( row = 0 ; row < rows ; row++ ) {
    for( col = 0 ; col < cols ; col++ ) {
      elems.push(
        boustrophedon.call(
          this,
          cornerX + col * halfVW,
          cornerY + row * halfVH,
          VW, VH, TW, TH
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
        )
      );
    }
  }

  return {
<<<<<<< HEAD
    shiftX: shiftX,
    shiftY: shiftY,
=======
    cornerX: cornerX,
    cornerY: cornerY,
    halfVW: halfVW,
    halfVH: halfVH,
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877
    cols: cols,
    rows: rows,
    elems: elems
  };
}


/**
 * Pour optimiser l'affichage, nous allons dessiner le terrain avec un
 * seul  appel  à  `drawElements`.    Pour  cela,  nous  utilisons  la
 * procédure `TRIANGLE_STRIP`. Il nous faut donc mettre les index dans
 * le  bon  ordre  pour  remplir   un  rectangle  avec  des  triangles
 * contigüs.   La  technique   consiste  à   utiliser  la   marche  en
 * boustrophédon. C'est à  dire qu'on parcours une rangée  de gauche à
 * droite, puis la rangés suivante de droite à gauche.
 */
function boustrophedon( x, y, w, h, W, H ) {
  var that = this;

  var I = function( col, row ) {
    return that.index( col + x, row + y );
  };
  var col, row;
  var colMin = Math.max( 0, -x );
  var colMax = w - 1 - Math.max( 0, w + x - W );
  var rowMin = Math.max( 0, -y );
  var rowMax = h - 1 - Math.max( 0, h + y - H );
  var data = [ I(colMin, rowMin) ];

  for ( row = rowMin; row < rowMax; row++ ) {
    for ( col = colMin; col < colMax; col++ ) {
      // 0---B---D
      // +  /+  /+
      // + / + / +
      // +/  +/  +
      // A---C---+
      // Let push A, then B, then C, then D, ...
      data.push(
        I( col, row + 1 ),
        I( col + 1, row )
      );
    }
    data.push( I( colMax, row + 1 ) );
    // If there is a row left, let's go backward.
    row++;
    if ( row >= rowMax ) break;
    for ( col = colMax; col > colMin; col-- ) {
      // D---B---0
      // +\  +\  +
      // + \ + \ +
      // +  \+  \+
      // +---C---A
      // Let push A, then B, then C, then D, ...
      data.push(
        I( col, row + 1 ),
        I( col - 1, row )
      );
    }
    data.push( I( colMin, row + 1 ) );
  }

  return new Uint16Array( data );
}


  
module.exports._ = _;
/**
 * @module terrain
 * @see module:$
 * @see module:util
<<<<<<< HEAD
 * @see module:controls
=======
>>>>>>> ee8d1783b7f991c40a44f20f686a8fa749995877

 */
});