/** @module app */require( 'app', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 "use strict";

var WebGL = require("tfw.webgl");
var World = require("world");


exports.start = function() {
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    var renderer = new WebGL.Renderer( canvas );
    var world = new World( renderer.gl );
    world.loadTerrain( 'main' );

    renderer.start(function( time ) {
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        canvas.width = w;
        canvas.height = h;

        world.render( time, w, h );
    });
};


  
module.exports._ = _;
/**
 * @module app
 * @see module:$
 * @see module:app
 * @see module:tfw.webgl
 * @see module:world

 */
});