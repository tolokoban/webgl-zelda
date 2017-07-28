/** @module util */require( 'util', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";


exports.clamp = function(v, min, max) {
  if( v < min ) return min;
  if( v > max ) return max;
  return v;
};


exports.propReadOnly = function( obj, attributes, value ) {
  var name;

  if( typeof attributes === 'string' ) {
    name = attributes;
    attributes = {};
    attributes[name] = value;
  }

  for( name in attributes ) {
    Object.defineProperty( obj, name, {
      value: attributes[name],
      writable: false,
      enumerable: true,
      configurable: false
    });
  }
};


/**
 * Converti des degrés en radians.
 */
exports.rad = function( deg ) {
  return Math.PI * deg / 180;
};


exports.loadImages = function( sources ) {
  var names = [];
  for( var name in sources ) {
    names.push( name );
  }
  var count = names.length;
  
  return new Promise(function (resolve, reject) {
    var result = {};
    names.forEach(function (name) {
      var src = sources[name];
      var img = new Image();
      img.src = src;
      img.onerror = function() {
        console.error("Unable to load image: ", src);
        count--;
        if( count === 0 ) resolve( result );
      };
      img.onload = function() {
        result[name] = img;
        count--;
        if( count === 0 ) resolve( result );
      };
    });
  });
};


exports.createCanvas = function( color, width, height ) {
  if( typeof color === 'undefined' ) color = "#000";
  if( typeof width === 'undefined' ) width = 256;
  if( typeof height === 'undefined' ) height = 256;

  var canvas = document.createElement('canvas');
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  if ( typeof color === 'string' ) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
  }
  return canvas;
}


exports.createTextureWrap = function( gl ) {
  var texture = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

  return texture;
};


  
module.exports._ = _;
/**
 * @module util
 * @see module:$

 */
});