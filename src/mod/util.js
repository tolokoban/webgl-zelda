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
