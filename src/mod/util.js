"use strict";


exports.clamp = function(v, min, max) {
  if( v < min ) return min;
  if( v > max ) return max;
  return v;
};
