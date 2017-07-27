/** @module terrain */require( 'terrain', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    /**
 * Le terrain est une grille qui peut être plus grande que l'écran.
 * Cette classe permet de n'afficher que la partie visible en stoquant
 * tous les vertex  dans la carte graphique, mais en  ne dessinant que
 * ceux fournis par un tableau d'index qui dépend de la position de la
 * caméra.
 */
"use strict";


function Terrain(opts) {
  if( typeof opts === 'undefined' ) opts = {};
  if( typeof opts.width === 'undefined' ) opts.width = 120;
  if( typeof opts.height === 'undefined' ) opts.height = 120;
  if( typeof opts.viewW === 'undefined' ) opts.viewW = 32;
  if( typeof opts.viewH === 'undefined' ) opts.viewH = 32;

  var w = opts.width + 1;
  var h = opts.height + 1;
  this.vert = new Float32Array( w * h * 6 );

  this.index = function( x, y ) {
    x = Math.floor( 0.5 + x ) % w;
    y = Math.floor( 0.5 + y ) % h;
    return y * w + x;
  };

  var elems = createElems.call( this, w, h, opts.viewW + 1, opts.viewH + 1 );
  console.info("[terrain] elems=", elems);
}

module.exports = Terrain;


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
        )
      );
    }
  }

  return {
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

 */
});