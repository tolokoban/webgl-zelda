"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");
var Faces = require("world.terrain.faces");
var Water = require("world.terrain.water");
var Keys = require("keys");



var World = function(gl) {
    this._gl = gl;

    // Theta est l'angle à plat ente [0 et 2 PI].
    this.lookTheta = Math.random() * 2 * Math.PI;
    // Phi est l'angle vertical entre [-PI et +PI].
    this.lookPhi = Math.random() * Math.PI / 2;
    // Rho est la distance de la caméra au point regardé.
    this.lookRho = 5;

    this.worldTerrainFaces = new Faces( gl );
    this.worldTerrainWater = new Water( gl );
};


/**
 * @return void
 */
World.prototype.loadTerrain = function( id ) {
    var terrain = Levels[id].alti;
    var rows = terrain.length;
    var cols = terrain[0].length;
    this.lookX = cols / 2;
    this.lookY = rows / 2;
    this.lookZ = terrain[Math.floor(this.lookY)][Math.floor(this.lookX)];

    this.worldTerrainFaces.loadTerrain( id );
    this.worldTerrainWater.loadTerrain( id );
};


var VARS = ['lookX', 'lookY', 'lookZ', 'lookTheta', 'lookPhi', 'lookRho'];

/**
 * @return void
 */
World.prototype.render = function( time, delta, w, h ) {
    var that = this;
    var gl = this._gl;

    if (Keys.test(107)) {
        this.lookRho = Math.max(1, this.lookRho - delta * 0.005);
    }
    else if (Keys.test(109)) {
        this.lookRho = Math.min(10, this.lookRho + delta * 0.005);
    }
    if (Keys.test(39)) {
        this.lookTheta = this.lookTheta - delta * 0.004;
    }
    else if (Keys.test(37)) {
        this.lookTheta = this.lookTheta + delta * 0.004;
    }
    if (Keys.test(40)) {
        this.lookPhi = Math.max(0, this.lookPhi - delta * 0.002);
    }
    else if (Keys.test(38)) {
        this.lookPhi = Math.min(Math.PI / 2, this.lookPhi + delta * 0.002);
    }


    // Set the viewport to match
    gl.viewport(0, 0, w, h);
    // Clear the screen.
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    [this.worldTerrainFaces, this.worldTerrainWater].forEach(function (worldPart) {
        VARS.forEach(function (name) {
            worldPart[name] = that[name];
        });
        worldPart.render( time, w, h );
    });
};




module.exports = World;
