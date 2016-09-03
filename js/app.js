/** @module app */require( 'app', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
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

    renderer.start(function( time, delta ) {
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        canvas.width = w;
        canvas.height = h;

        world.render( time, delta, w, h );
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


  
module.exports._ = _;
/**
 * @module app
 * @see module:$
 * @see module:app
 * @see module:dom
 * @see module:levels
 * @see module:tfw.data-binding
 * @see module:tfw.webgl
 * @see module:wdg.combo
 * @see module:world

 */
});