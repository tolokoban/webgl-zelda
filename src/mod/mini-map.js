"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Util = require("util")
;

function MiniMap(opts) {
  var that = this;

  var canvas1 = Util.createCanvas( "#39f" );
  var canvas2 = Util.createCanvas( null );

  this._canvas1 = canvas1;
  this._canvas2 = canvas2;

  var elem = $.elem( this, 'div', 'mini-map thm-ele4', [
    canvas1, canvas2
  ]);

  DB.prop( this, 'terrain' )( function(terrain) {
    if ( !terrain ) return;

    var w = terrain.width;
    var h = terrain.height;
    var zoom;
    if ( w >= h ) {
      // Paysage.
      zoom = 256 / w;
    } else {
      // Portrait.
      zoom = 256 / h;
    }
    that._zoom = zoom;

    $.att( canvas1, { width: w, height: h } );
    $.att( canvas2, { width: w, height: h } );
    $.css( elem, {
      width: w * zoom + "px",
      height: h * zoom + "px"
    });
    
    MiniMap.prototype.update.call( that );
  });

  DB.extend({
    terrain: null
  }, opts, this);

  var paint = function(x, y) {
    if( !that.terrain ) return;
    var zoom = that._zoom;
    x /= zoom;
    y /= zoom;
    y = that.terrain.height - y;
    var ctx = canvas2.getContext('2d');
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc( x, y, 3, 0, Math.PI * 2, false );
    ctx.closePath();
    ctx.fill();
  };

  $.on( elem, {
    down: function( evt ) {
      paint( evt.x, evt.y );
    },
    drag: function( evt ) {
      paint( evt.x, evt.y );
    }
  });
}

module.exports = MiniMap;


var COLORS = [
  [0, [0xdd, 0xcc, 0x77]],
  [3, [0, 255, 0]],
  [9, [0x88, 0x33, 0]],
  [12, [127, 127, 127]],
  [15, [255, 255, 255]],
  [99, [255, 255, 255]]
];


MiniMap.prototype.getSelection = function() {
  var canvas = this._canvas2;
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
  return imageData.data;
};


MiniMap.prototype.clearSelection = function() {
  var canvas = this._canvas2;
  var ctx = canvas.getContext("2d");
  ctx.clearRect( 0, 0, canvas.width, canvas.height );
};


/**
 * @member MiniMap.update
 * @param
 */
MiniMap.prototype.update = function() {
  var terrain = this.terrain;
  if ( !terrain ) return;

  var w = terrain.width;
  var h = terrain.height;
  var zoom = this._zoom;

  var vert = terrain.vert;
  var size = vert.length / terrain.STRIDE;
  var idxSrc = 0;
  var idxDst = 0;
  var z;

  var ctx = this._canvas1.getContext( '2d' );
  var data = ctx.createImageData( w, h );
  var colorIdx;
  var zMin, zMax, color0, color1;

  while( size --> 0 ) {
    z = vert[idxSrc + 2];
    idxSrc += terrain.STRIDE;

    if( z < 0 ) {
      data.data[ idxDst + 0 ] = 51;
      data.data[ idxDst + 1 ] = 153;
      data.data[ idxDst + 2 ] = 255;
    } else {
      for( colorIdx = 0 ; colorIdx < COLORS.length - 1 ; colorIdx++ ) {
        if( COLORS[colorIdx][0] > z ) {
          colorIdx--;
          break;
        }
      }
      colorIdx = Math.min( colorIdx, COLORS.length - 2 );
      zMin = COLORS[colorIdx][0];
      color0 = COLORS[colorIdx][1];
      zMax = COLORS[colorIdx + 1][0];
      color1 = COLORS[colorIdx + 1][1];

      z = (z - zMin) / (zMax - zMin);
      data.data[ idxDst + 0 ] = (1 - z) * color0[0] + z * color1[0];
      data.data[ idxDst + 1 ] = (1 - z) * color0[1] + z * color1[1];
      data.data[ idxDst + 2 ] = (1 - z) * color0[2] + z * color1[2];
    }

    data.data[ idxDst + 3 ] = 255;
    idxDst += 4;
  }

  ctx.putImageData( data, 0, 0 );
};
