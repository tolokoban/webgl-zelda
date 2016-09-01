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
