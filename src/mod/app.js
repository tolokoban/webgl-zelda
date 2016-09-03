"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var WebGL = require("tfw.webgl");
var World = require("world");
var Combo = require("wdg.combo");
var Levels = require("levels");



exports.start = function() {
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    var renderer = new WebGL.Renderer( canvas );
    var world = new World( renderer.gl );

    renderer.start(function( time ) {
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        canvas.width = w;
        canvas.height = h;

        world.render( time, w, h );
    });

    var ids = [], content = {};
    for (var id in Levels) {
        if (id == '_') continue;
        ids.push(id);
        content[id] = id;
    }
    ids.sort();
    var cbo = new Combo({ label: "Niveau", content: content, wide: false });
    DB.bind(cbo, 'value', function(v) {
        world.loadTerrain(v);
    });
    cbo.value = ids[0];
    $.add( document.body, cbo );
};
