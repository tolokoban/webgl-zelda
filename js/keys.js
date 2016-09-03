/** @module keys */require( 'keys', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var KEYS = [];


document.addEventListener('keydown', function(evt) {
    KEYS[evt.keyCode] = true;
    console.log(evt.keyCode);
});


document.addEventListener('keyup', function(evt) {
    KEYS[evt.keyCode] = false;
});


exports.test = function(keyCode) {
    return KEYS[keyCode];
};


  
module.exports._ = _;
/**
 * @module keys
 * @see module:$
 * @see module:keys

 */
});