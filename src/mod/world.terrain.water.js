"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");


var Water = function( gl ) {
    this._gl = gl;
    this._prg = new WebGL.Program(gl, {
        vert: GLOBAL['vert'],
        frag: GLOBAL['frag']
    });
};


/**
 * @return void
 */
Water.prototype.loadTerrain = function( id ) {

    var arr = [];
    var alti = Levels[id].alti;

    var rows = alti.length;
    var cols = alti[0].length;

    arr = disk(0, 0, 3000);

    this._arrAttributes = new Float32Array( arr );
    this._bufAttributes = this._gl.createBuffer();
};


/**
 * @return void
 */
Water.prototype.render = function( time, w, h ) {
    var gl = this._gl;
    var prg = this._prg;
    var bpe = this._arrAttributes.BYTES_PER_ELEMENT;

    prg.use();

    // Les uniforms.
    prg.$uniWidth = w;
    prg.$uniHeight = h;
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
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.TRIANGLES, 0, this._arrAttributes.length / size);

    if (this._arrAttributes[5] + 1800 < time) {
        disk2(this._arrAttributes, 0, 0, 0, time + Math.random() * 3000);
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


function disk(x, y, time) {
    var r = 2;
    var z = -1;
    return [
        // x,  y,     z,  u,  v, time
        x - r, y - r, z, -1, -1, time,
        x - r, y + r, z, -1, +1, time,
        x + r, y + r, z, +1, +1, time,
        x + r, y + r, z, +1, +1, time,
        x + r, y - r, z, +1, -1, time,
        x - r, y - r, z, -1, -1, time
    ];
}


function disk2(arr, offset, x, y, time) {
    var r = 2;
    var z = -1;

    [
        // x,  y,     z,  u,  v, time
        x - r, y - r, z, -1, -1, time,
        x - r, y + r, z, -1, +1, time,
        x + r, y + r, z, +1, +1, time,
        x + r, y + r, z, +1, +1, time,
        x + r, y - r, z, +1, -1, time,
        x - r, y - r, z, -1, -1, time
    ].forEach(function (val, idx) {
        arr[36 * offset + idx] = val;
    });
}

module.exports = Water;
