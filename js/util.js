/** @module util */require( 'util', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";


exports.clamp = function(v, min, max) {
  if( v < min ) return min;
  if( v > max ) return max;
  return v;
};


  
module.exports._ = _;
/**
 * @module util
 * @see module:$

 */
});