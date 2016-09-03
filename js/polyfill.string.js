/** @module polyfill.string */require( 'polyfill.string', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 // IE11 doe not support String.toLowerCase().
if (typeof String.toLowerCase !== 'function') {
    String.toLowerCase = function(v) { return v.toLowerCase(); };
    String.toUpperCase = function(v) { return v.toUpperCase(); };
    String.trim = function(v) { return v.trim(); };
}


  
module.exports._ = _;
/**
 * @module polyfill.string
 * @see module:$
 * @see module:polyfill.string

 */
});