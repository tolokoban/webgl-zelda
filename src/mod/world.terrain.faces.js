"use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");
var VertexArray = require("vertex-array");


var Faces = function( gl ) {
    this._gl = gl;
    this._prgWalls = new WebGL.Program(gl, {
        vert: GLOBAL['vert'],
        frag: GLOBAL['frag']
    });
    this._prgGround = new WebGL.Program(gl, {
        vert: GLOBAL['vert-ground'],
        frag: GLOBAL['frag-ground']
    });
};

/**
 * @return void
 */
Faces.prototype.loadTerrain = function( id ) {
    var r0 = 0;
    var g0 = .3;
    var b0 = 0;
    var r1 = .4;
    var g1 = .2;
    var b1 = 0;
    var r2 = .3;
    var g2 = .15;
    var b2 = 0;

    var arrWalls = [];
    var alti = Levels[id].alti;

    var rows = alti.length;
    var cols = alti[0].length;

    // Ground.
    var ground = new VertexArray();
    alti.forEach(function (row, y) {
        row.forEach(function (z, x) {
            if ( z < 0 ) return;
            // Top
            var f1 = flag(alti, x + 0, y + 0, z);
            var f2 = flag(alti, x + 0, y + 1, z);
            var f3 = flag(alti, x + 1, y + 1, z);
            var f4 = flag(alti, x + 1, y + 0, z);
            ground.add( x + 0, y + 0, z, f1[0], f1[1] );
            ground.add( x + 0, y + 1, z, f2[0], f2[1] );
            ground.add( x + 1, y + 1, z, f3[0], f3[1] );
            ground.add( x + 1, y + 1, z, f3[0], f3[1] );
            ground.add( x + 1, y + 0, z, f4[0], f4[1] );
            ground.add( x + 0, y + 0, z, f1[0], f1[1] );
        });
    });
    this._ground = ground.toBufferArrays();
    //console.info("[world.terrain.faces] this._ground=...", this._ground);

    // Walls.
    alti.forEach(function (row, y) {
        row.forEach(function (z, x) {
            if ( z < 0 ) return;
            var zz;
            // Front
            zz = height(alti, x, y - 1);
            if (zz < z) {
                arrWalls = arrWalls.concat(quad(
                    x + 0, y + 0, z,
                    x + 1, y + 0, z,
                    x + 1, y + 0, zz,
                    x + 0, y + 0, zz,
                    r1, g1, b1, z
                ));
            }
            // Back
            zz = height(alti, x, y + 1);
            if (zz < z) {
                arrWalls = arrWalls.concat(quad(
                    x + 1, y + 1, z,
                    x + 0, y + 1, z,
                    x + 0, y + 1, zz,
                    x + 1, y + 1, zz,
                    r1, g1, b1, z
                ));
            }
            // Left
            zz = height(alti, x - 1, y);
            if (zz < z) {
                arrWalls = arrWalls.concat(quad(
                    x + 0, y + 0, z,
                    x + 0, y + 0, zz,
                    x + 0, y + 1, zz,
                    x + 0, y + 1, z,
                    r2, g2, b2, z
                ));
            }
            // Right
            zz = height(alti, x + 1, y);
            if (zz < z) {
                arrWalls = arrWalls.concat(quad(
                    x + 1, y + 0, zz,
                    x + 1, y + 0, z,
                    x + 1, y + 1, z,
                    x + 1, y + 1, zz,
                    r2, g2, b2, z
                ));
            }
        });
    });
    console.info("[world] arrWalls.length / 7=...", arrWalls.length / 7);

    this._arrWalls = new Float32Array( arrWalls );
    this._bufWalls = this._gl.createBuffer();

    this._bufGroundVert = this._gl.createBuffer();
    this._bufGroundElem = this._gl.createBuffer();
};


/**
 * @return void
 */
Faces.prototype.render = function( time, w, h ) {
    if (!this._arrWalls) return;

    var gl = this._gl;
    var prgWalls = this._prgWalls;
    var prgGround = this._prgGround;

    // Ne pas afficher les faces qui nous tournent le dos.
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);

    //----------------------------------------
    // Walls.
    prgWalls.use();

    // Les uniforms.
    prgWalls.$uniWidth = w;
    prgWalls.$uniHeight = h;
    prgWalls.$uniTime = time;
    prgWalls.$uniTimeFrag = time;
    prgWalls.$uniLookX = this.lookX;
    prgWalls.$uniLookY = this.lookY;
    prgWalls.$uniLookZ = this.lookZ;
    prgWalls.$uniLookPhi = this.lookPhi;
    prgWalls.$uniLookTheta = this.lookTheta;
    prgWalls.$uniLookRho = this.lookRho;

    // Définir ce buffer comme le buffer actif.
    gl.bindBuffer(gl.ARRAY_BUFFER, this._bufWalls);
    // Copier des données dans le buffer actif.
    gl.bufferData(gl.ARRAY_BUFFER, this._arrWalls, gl.STATIC_DRAW);

    prgWalls.enableVertexAttribFloat32Array(
        'attPosition', 'attColor', 'attThreshold'
    );
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.TRIANGLES, 0, this._arrWalls.length / 7);

    //----------------------------------------
    // Ground.
    prgGround.use();

    // Les uniforms.
    prgGround.$uniWidth = w;
    prgGround.$uniHeight = h;
    prgGround.$uniTime = time;
    prgGround.$uniTimeFrag = time;
    prgGround.$uniLookX = this.lookX;
    prgGround.$uniLookY = this.lookY;
    prgGround.$uniLookZ = this.lookZ;
    prgGround.$uniLookPhi = this.lookPhi;
    prgGround.$uniLookTheta = this.lookTheta;
    prgGround.$uniLookRho = this.lookRho;

    // Définir ce buffer comme le buffer actif.
    gl.bindBuffer(gl.ARRAY_BUFFER, this._bufGroundVert);
    // Copier des données dans le buffer actif.
    gl.bufferData(gl.ARRAY_BUFFER, this._ground.vert, gl.STATIC_DRAW);

    prgGround.enableVertexAttribFloat32Array(
        'attPosition', 'attFlag'
    );

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._bufGroundElem );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this._ground.elem, gl.STATIC_DRAW );

    gl.drawElements(gl.TRIANGLES, this._ground.elem.length, gl.UNSIGNED_SHORT, 0);
};


function height(alti, x, y) {
    if (y < 0 || y >= alti.length) return -3;
    var row = alti[y];
    if (x < 0 || x >= row.length) return -3;
    var h = row[x];
    if (h < 0) return -3;
    return h;
}


function flag(alti, x, y, z) {
    var vx = 0;
    var vy = 0;
    var bit = 0;
    if (z != height(alti, x + 0, y + 0)) bit += 1;
    if (z != height(alti, x - 1, y + 0)) bit += 2;
    if (z != height(alti, x - 1, y - 1)) bit += 4;
    if (z != height(alti, x + 0, y - 1)) bit += 8;

    return [
        [0,0],  [-1,-1], [1,-1], [1,1],
        [1,1],  [0,0],   [1,0],  [1,-1],
        [-1,1], [-1,0],  [0,0],  [-1,-1],
        [0,1],  [-1,1],  [1,1],  [0,0]
    ][bit];
}


function quad(x1, y1, z1,
              x2, y2, z2,
              x3, y3, z3,
              x4, y4, z4,
              r, g, b, h)
{
    if( typeof h === 'undefined' ) h = 0;

    return [
        x1, y1, z1, r, g, b, h,
        x2, y2, z2, r, g, b, h,
        x3, y3, z3, r, g, b, h,
        x1, y1, z1, r, g, b, h,
        x3, y3, z3, r, g, b, h,
        x4, y4, z4, r, g, b, h
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


module.exports = Faces;
