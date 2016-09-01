"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");


var World = function(gl) {
    this._gl = gl;
    this._prg = new WebGL.Program(gl, {
        vert: GLOBAL['vert-perspective'],
        frag: GLOBAL['frag-unicolor']
    });

};


/**
 * @return void
 */
World.prototype.loadTerrain = function( id ) {
    var arr = quads(
        [
            0, 0, 1,
            0, 1, 1,
            1, 1, 1,
            1, 0, 1,
            .3, .5, 0
        ],
        [
            0, 0, 1,
            1, 0, 1,
            1, 0, 0,
            0, 0, 0,
            .6, 0, 0
        ],
        [
            1, 1, 1,
            2, 1, 1,
            2, 1, 0,
            1, 1, 0,
            .5, 0, 0
        ],
        [
            0, 1, 1,
            0, 3, 1,
            2, 3, 1,
            2, 1, 1,
            .5, .8, 0
        ]
    );

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    renderTerrainFaces.call( this, time, w, h );
};


function renderTerrainFaces( time, w, h ) {
    var gl = this._gl;
    var prg = this._prg;
    var bpe = this._arrAttributes.BYTES_PER_ELEMENT;

    prg.use();

    // Les uniforms.
    gl.uniform1f(prg.uniforms.uniWidth, w);
    gl.uniform1f(prg.uniforms.uniHeight, h);
    gl.uniform1f(prg.uniforms.uniTime, time);
    //gl.uniform3fv(prg.uniforms.uniLookAt, lookAt);

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
console.info("[world] attributes=...", attributes);
    return attributes;
}


module.exports = World;
