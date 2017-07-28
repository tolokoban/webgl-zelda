/** @module tfw.touchable */require( 'tfw.touchable', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

/**
 * @module tfw.touchable
 *
 * @description
 * Turn  a DOM  element  into  a touchable  one  with material  design
 * animation: a growing transparent disk.
 *
 * @example
 * var Touchable = require('tfw.touchable');
 * var div = document.querySelector('#button');
 * var touchable = new Touchable( div, {
 *   opacity: .2,
 *   color: "white"
 * });
 * touchable.tap.add(function() { ... });
 * touchable.press.add(function() { ... });
 */

var $ = require( "dom" );
var Fx = require( "dom.fx" );
var Listeners = require( "tfw.listeners" );

var Touchable = function ( elem, opts ) {
  var that = this;

  if ( typeof opts === 'undefined' ) opts = {};
  if ( typeof opts.enabled === 'undefined' ) opts.enabled = true;
  elem = $( elem );
  this.enabled = opts.enabled;
  this.color = opts.color || "#fd8";
  this.classToAdd = opts.classToAdd;
  this.opacity = opts.opacity || 0.4;
  this.element = $( elem );
  this.tap = new Listeners();
  this.press = new Listeners();

  $.addClass( elem, 'tfw-touchable' );
  var shadow = $.div( 'tfw-touchable-shadow' );
  var fxDown = Fx().css( shadow, {
    transition: "none",
    transform: "scale(0)"
  } )
      .exec( function ( session ) {
        var cls = that.classToAdd;
        if ( typeof cls === 'string' ) {
          $.addClass( elem, cls );
        }
        // Position must not be `static`.
        var position = getComputedStyle( elem ).position;
        if ( [ 'relative', 'absolute', 'fixed' ].indexOf( position ) == -1 ) {
          elem.style.position = 'relative';
        }
        elem.style.overflow = 'hidden';
        var rect = elem.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        w = Math.max( lastX, w - lastX );
        h = Math.max( lastY, h - lastY );
        var radius = Math.ceil( Math.sqrt( w * w + h * h ) );
        $.css( shadow, {
          left: lastX + "px",
          top: lastY + "px",
          margin: "-" + radius + "px",
          width: 2 * radius + "px",
          height: 2 * radius + "px",
          opacity: that.opacity,
          background: that.color,
          transform: "scale(0)"
        } );
        $.add( elem, shadow );
      } )
      .css( shadow, {
        transition: "all .3s ease"
      } )
      .css( shadow, {
        transform: "scale(1)"
      } )
      .wait( 300 )
      .css( shadow, {
        transition: "all .2s ease"
      } )
      .css( shadow, {
        opacity: 0
      } )
      .wait( 200 )
      .detach( shadow )
      .exec(function() {
        var cls = that.classToAdd;
        if ( typeof cls === 'string' ) {
          $.removeClass( elem, cls );
        }
      });
  var time = 0;
  var lastX, lastY;
  var removeShadow = 0;

  $.on( elem, {
    down: function ( evt ) {
      if ( !that.enabled ) return;
      evt.stopPropagation();
      evt.preventDefault();
      lastX = Math.floor( evt.x );
      lastY = Math.floor( evt.y );
      fxDown.start();
      time = Date.now();
    },
    tap: function ( evt ) {
      if ( !that.enabled ) return;
      console.log( 'TAP', evt );
      that.tap.fire( evt );
    }
  } );
};


module.exports = Touchable;



/*
  https://jsfiddle.net/mzmaczdn/7/


  var div = document.createElement('div');
  div.className = 'shadow';

  var btn = document.querySelector('button');
  btn.addEventListener('mousedown', function(evt) {
  btn.className = "press";
  btn.appendChild( div );
  div.style.left = evt.offsetX + "px";
  div.style.top = evt.offsetY + "px";
  window.setTimeout(function() {
  div.style.transform = "scale(1)";
  });
  });

  btn.addEventListener('mouseup', function(evt) {
  div.style.transform = "scale(0)";
  btn.removeChild(div);
  });
*/


  
module.exports._ = _;
/**
 * @module tfw.touchable
 * @see module:$
 * @see module:dom
 * @see module:dom.fx
 * @see module:tfw.listeners

 */
});