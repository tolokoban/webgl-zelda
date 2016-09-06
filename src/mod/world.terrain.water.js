"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");


var Water = function( gl ) {
    this._gl = gl;
    this._prg = new WebGL.Program(gl, {
        vert: GLOBAL['vert'],
        frag: GLOBAL['frag']
    });
    console.info("[world.terrain.water] this._prg.attribs=...", this._prg.attribs);
    console.info("[world.terrain.water] this._prg.uniforms=...", this._prg.uniforms);
};


/**
 * @return void
 */
Water.prototype.loadTerrain = function( id ) {

    var arr = [];
    var alti = Levels[id].alti;
    
    var rows = alti.length;
    var cols = alti[0].length;

    // Find cells near water.
    var cells = [];
    alti.forEach(function (row, y) {
        row.forEach(function (z, x) {
            if (z < 0) return;
            if (height(alti, x - 1, y) < 0 || height(alti, x + 1, y) < 0
                || height(alti, x, y - 1) < 0 || height(alti, x, y + 1) < 0 )
            {
                cells.push([x + .5, y + .5]);
            }
        });
    });

    this._cells = cells;
    this._nbPuddles = 7;
    this._arrAttributes = new Float32Array( 30 * this._nbPuddles );

    for( var k = 0; k < this._nbPuddles; k++ ) {
        this.randomDisk(k, Math.random() * 3000);
    }

    this._bufAttributes = this._gl.createBuffer();
};


/**
 * @return void
 */
Water.prototype.randomDisk = function( index, time ) {
    var that = this;

    var cell = this._cells[Math.floor(Math.random() * this._cells.length)];
    var r = 1 + 2 * Math.random();
    var x = cell[0];
    var y = cell[1];

    [
        // x,  y,      u,  v, time
        x - r, y - r, -1, -1, time,
        x - r, y + r, -1, +1, time,
        x + r, y + r, +1, +1, time,
        x + r, y + r, +1, +1, time,
        x + r, y - r, +1, -1, time,
        x - r, y - r, -1, -1, time
    ].forEach(function (val, idx) {
        that._arrAttributes[30 * index + idx] = val;
    });    
};

/**
 * @return void
 */
Water.prototype.render = function( time, w, h ) {
    if (!this._arrAttributes) return;
    
    var gl = this._gl;
    var prg = this._prg;

    prg.use();

    // Les uniforms.
    prg.$uniWidth = w;
    prg.$uniHeight = h;
    prg.$uniTime = time;
    prg.$uniTimeFrag = time;
    prg.$uniLookX = this.lookX;
    prg.$uniLookY = this.lookY;
    prg.$uniLookZ = this.lookZ;
    prg.$uniLookPhi = this.lookPhi;
    prg.$uniLookTheta = this.lookTheta;
    prg.$uniLookRho = this.lookRho;

    // Définir ce buffer comme le buffer actif.
    gl.bindBuffer(gl.ARRAY_BUFFER, this._bufAttributes);
    // Copier des données dans le buffer actif.
    gl.bufferData(gl.ARRAY_BUFFER, this._arrAttributes, gl.STATIC_DRAW);

    var size = prg.enableVertexAttribFloat32Array(
        'attPosition', 'attU', 'attV', 'attT'
    );

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.TRIANGLES, 0, this._arrAttributes.length / size);

    for( var k = 0; k < this._nbPuddles; k++ ) {
        if (this._arrAttributes[30 * k + 4] + 1800 < time) {
            this.randomDisk( k, time + Math.random() * 2000 );
        }
    }
};


function height(alti, x, y) {
    if (y < 0 || y >= alti.length) return -2;
    var row = alti[y];
    if (x < 0 || x >= alti.row) return -2;
    var h = row[x];
    if (h < 0) return -2;
    return h;
}


function height(alti, x, y) {
    if (y < 0 || y >= alti.length) return -2;
    var row = alti[y];
    if (x < 0 || x >= row.length) return -2;
    var h = row[x];
    if (h < 0) return -2;
    return h;
}


module.exports = Water;
