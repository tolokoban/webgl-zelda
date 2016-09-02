/** @module world */require( 'world', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 "use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");
var Edges = require("world.terrain.edges");


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

    this.worldTerrainEdges = new Edges( gl );
};


/**
 * @return void
 */
World.prototype.loadTerrain = function( id ) {
    this.worldTerrainEdges.loadTerrain( id );

    var r0 = 0;
    var g0 = .3;
    var b0 = 0;
    var r1 = .4;
    var g1 = .2;
    var b1 = 0;
    var r2 = .3;
    var g2 = .15;
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
                    r1, g1, b1
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
                    r2, g2, b2
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


    this.worldTerrainEdges.lookX = this.lookX;
    this.worldTerrainEdges.lookY = this.lookY;
    this.worldTerrainEdges.lookZ = this.lookZ;
    this.worldTerrainEdges.lookTheta = this.lookTheta;
    this.worldTerrainEdges.lookPhi = this.lookPhi;
    this.worldTerrainEdges.lookRho = this.lookRho;

    this.worldTerrainEdges.render( time, w, h );
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


var GLOBAL = {
  "vert-perspective": "uniform float uniWidth;\nuniform float uniHeight;\nuniform float uniTime;\nuniform float uniLookX;\nuniform float uniLookY;\nuniform float uniLookZ;\nuniform float uniLookPhi;\nuniform float uniLookTheta;\nuniform float uniLookRho;\n\nattribute vec3 attPosition;\nattribute vec3 attColor;\n\nvarying vec3 varColor;\nvarying float varHeight;\n\nconst float DEPTH = 27.0;\nconst float DIST = 50.0;\nconst float ZOOM = 64.0;\n\nconst float PI = 3.141592653589793;\n  \nvoid main() {\n  float theta = uniTime * 0.00012 * PI;\n  float phi = (1.0 + sin(uniTime * 0.000842)) * .1 * PI;\n  float rho = 50.0;\n\n  float cosPhi = cos(phi);      // 1\n  float sinPhi = sin(phi);      // 0\n  float cosTheta = cos(theta);  // 1\n  float sinTheta = sin(theta);  // 0\n  \n  float camX = cosPhi * cosTheta;    // 1\n  float camY = cosPhi * sinTheta;    // 0\n  float camZ = sinPhi;               // 0\n\n  vec3 camVZ = -vec3(camX, camY, camZ);       // (-1,0,0)\n  vec3 camVX = vec3(sinTheta, -cosTheta, 0);  // (0,-1,0)\n  vec3 camVY = cross(camVZ, camVX);           // (0,0,1)\n\n  camX = camX * rho + uniLookX;\n  camY = camY * rho + uniLookY;\n  camZ = camZ * rho + uniLookZ;\n\n  camX = -0.0;\n  camY = -0.0;\n  camZ = -0.0;\n  \n  mat4 cameraMat = mat4(camVX.x, camVY.x, camVZ.x, 0.0,\n                        camVX.y, camVY.y, camVZ.y, 0.0,\n                        camVX.z, camVY.z, camVZ.z, 0.0,\n                        -camX,     -camY,   -camZ, 1.0);\n\n  vec4 pos = cameraMat * vec4(attPosition - vec3(uniLookX, uniLookY, uniLookZ), 1.0);\n  float zz = pos.z;\n  float xx = pos.x / uniWidth;\n  float yy = pos.y / uniHeight;\n  float w = ZOOM * DEPTH / (DEPTH + zz);\n  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);\n  \n  varColor = attColor; \n  varHeight = attPosition.z;\n}                \n",
  "frag-unicolor": "precision mediump float;\n\nvarying vec3 varColor;\nvarying float varHeight;\n\nconst vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);\nconst vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);\n\nvoid main() {\n  float alpha;\n  \n  gl_FragColor = vec4(varColor, 1.0);\n\n  if (varHeight < -1.0) {\n    if (varHeight > -1.1) {\n      gl_FragColor = BLUE;\n    } else {\n      alpha = -varHeight * .5;\n      gl_FragColor = mix( gl_FragColor, BLUE, alpha );\n    }\n  } else {\n    alpha = clamp((varHeight + 1.0) / 8.0, 0.0, 1.0);\n    gl_FragColor = mix( gl_FragColor, WHITE, alpha );\n  }\n}\n"};
 
module.exports._ = _;
/**
 * @module world
 * @see module:$
 * @see module:levels
 * @see module:tfw.webgl
 * @see module:world
 * @see module:world.terrain.edges

 */
});