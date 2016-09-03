"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");


var Edges = function( gl ) {
    this._gl = gl;
    this._prg = new WebGL.Program(gl, {
        vert: GLOBAL['vert-perspective'],
        frag: GLOBAL['frag-unicolor']
    });

};

/**
 * @return void
 */
Edges.prototype.loadTerrain = function( id ) {
    var arr = [];
    var alti = Levels[id].alti;

    var rows = alti.length;
    var cols = alti[0].length;

    alti.forEach(function (row, y) {
        row.forEach(function (z, x) {
            if ( z < 0 ) return;
            if (x == 0 || alti[y][x - 1] != z) {
                arr.push(
                    x, y, z,
                    x, y + 1, z
                );
            }
            if (x == cols - 1 || alti[y][x + 1] != z) {
                arr.push(
                    x + 1, y, z,
                    x + 1, y + 1, z
                );
            }
            if (y == 0 || alti[y - 1][x] != z) {
                arr.push(
                    x, y, z,
                    x + 1, y, z
                );
            }
            if (y == rows - 1 || alti[y + 1][x] != z) {
                arr.push(
                    x, y + 1, z,
                    x + 1, y + 1, z
                );
            }
        });
    });

    this._arrAttributes = new Float32Array(arr);
    this._bufAttributes = this._gl.createBuffer();
};


/**
 * @return void
 */
Edges.prototype.render = function( time, w, h ) {
    var gl = this._gl;
    var prg = this._prg;
    var bpe = this._arrAttributes.BYTES_PER_ELEMENT;

    prg.use();

    // Les uniforms.
    prg.$uniWidth = w;
    prg.$uniHeight = h;
    prg.$uniTime = time;
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

    gl.enableVertexAttribArray(prg.attribs.attPosition);
    gl.vertexAttribPointer(
        prg.attribs.attPosition, 3, gl.FLOAT, false, 3 * bpe, 0);

    gl.enable(gl.DEPTH_TEST);
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.LINES, 0, this._arrAttributes.length / 3);

};


module.exports = Edges;
