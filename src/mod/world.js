"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");


var World = function(gl) {
    this._gl = gl;
    this._prg = new WebGL.Program(gl, {
        vert: GLOBAL['vert-perspective'],
        frag: GLOBAL['frag-unicolor']
    });

    // Theta est l'angle à plat ente [0 et 2 PI].
    this.lookTheta = 0;
    // Phi est l'angle vertical entre [-PI et +PI].
    this.lookPhi = Math.PI / 4;
    // Rho est la distance de la caméra au point regardé.
    this.lookRho = 10;
};


/**
 * @return void
 */
World.prototype.loadTerrain = function( id ) {
    var r0 = 0;
    var g0 = .5;
    var b0 = 0;
    var r1 = .6;
    var g1 = .3;
    var b1 = 0;
    var r2 = .4;
    var g2 = .2;
    var b2 = 0;

    var arr = [];
    var alti = Levels[id].alti;

    var rows = alti.length;
    var cols = alti[0].length;

    this.lookX = Math.floor(cols / 2) + .5;
    this.lookY = Math.floor(rows / 2) + .5;
    this.lookZ = alti[Math.floor(rows / 2)][Math.floor(cols / 2)];
   
    alti.forEach(function (row, y) {
        row.forEach(function (z, x) {
            if ( z < 0 ) return;
            arr = arr.concat(quads(
                // Top
                [
                    x + 0, y + 0, z,
                    x + 0, y + 1, z,
                    x + 1, y + 1, z,
                    x + 1, y + 0, z,
                    r0, g0, b0
                ],
                // Front
                [
                    x + 0, y + 0, z,
                    x + 1, y + 0, z,
                    x + 1, y + 0, -2,
                    x + 0, y + 0, -2,
                    r1, g1, b1
                ],
                // Back
                [
                    x + 1, y + 1, z,
                    x + 0, y + 1, z,
                    x + 0, y + 1, -2,
                    x + 1, y + 1, -2,
                    1, 0, 0
                ],
                // Left
                [
                    x + 0, y + 0, z,
                    x + 0, y + 0, -2,
                    x + 0, y + 1, -2,                   
                    x + 0, y + 1, z,
                    r2, g2, b2
                ],
                // Right
                [
                    x + 1, y + 0, -2,
                    x + 1, y + 0, z,
                    x + 1, y + 1, z,                   
                    x + 1, y + 1, -2,
                    .5, .5, b2
                ]
            ));
        });
    });
   
    console.info("[world] arr.length / 6=...", arr.length / 6);

    this._arrAttributes = new Float32Array( arr );
    this._bufAttributes = this._gl.createBuffer();
};


/**
 * @return void
 */
World.prototype.render = function( time, w, h ) {
    var gl = this._gl;

    // Set the viewport to match
    gl.viewport(0, 0, w, h);
    // Clear the screen.
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderTerrainFaces.call( this, time, w, h );
};


function renderTerrainFaces( time, w, h ) {
    var gl = this._gl;
    var prg = this._prg;
    var bpe = this._arrAttributes.BYTES_PER_ELEMENT;

    prg.use();

    // Ne pas afficher les faces qui nous tournent le dos.
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

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
        prg.attribs.attPosition, 3, gl.FLOAT, false, 6 * bpe, 0);
    gl.enableVertexAttribArray(prg.attribs.attColor);
    gl.vertexAttribPointer(
        prg.attribs.attColor, 3, gl.FLOAT, false, 6 * bpe, 3 * bpe);

    gl.enable(gl.DEPTH_TEST);
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.TRIANGLES, 0, this._arrAttributes.length / 6);

}


function renderTerrainEdges( time, w, h ) {
    var gl = this._gl;
    var prg = this._prg;
    var bpe = this._arrAttEdges.BYTES_PER_ELEMENT;

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
        prg.attribs.attPosition, 3, gl.FLOAT, false, 6 * bpe, 0);
    gl.enableVertexAttribArray(prg.attribs.attColor);
    gl.vertexAttribPointer(
        prg.attribs.attColor, 3, gl.FLOAT, false, 6 * bpe, 3 * bpe);

    gl.enable(gl.DEPTH_TEST);
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.TRIANGLES, 0, this._arrAttributes.length / 6);

}



function quad(x1, y1, z1,
              x2, y2, z2,
              x3, y3, z3,
              x4, y4, z4,
              r, g, b)
{
    return [
        x1, y1, z1, r, g, b,
        x2, y2, z2, r, g, b,
        x3, y3, z3, r, g, b,
        x1, y1, z1, r, g, b,
        x3, y3, z3, r, g, b,
        x4, y4, z4, r, g, b
    ];
}


function quads() {
    var attributes = [];
    var i, arg;

    for (i = 0 ; i < arguments.length ; i++) {
        arg = arguments[i];
        attributes = attributes.concat(quad.apply(null, arg));
    }
    return attributes;
}


module.exports = World;
