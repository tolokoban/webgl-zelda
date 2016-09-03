/** @module world.terrain.edges */require( 'world.terrain.edges', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
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


var GLOBAL = {
  "vert-perspective": "uniform float uniWidth;\nuniform float uniHeight;\nuniform float uniTime;\nuniform float uniLookX;\nuniform float uniLookY;\nuniform float uniLookZ;\nuniform float uniLookPhi;\nuniform float uniLookTheta;\nuniform float uniLookRho;\n\nattribute vec3 attPosition;\n\nconst float DEPTH = 27.0;\nconst float DIST = 50.0;\nconst float ZOOM = 64.0;\n\nconst float PI = 3.141592653589793;\n  \nvoid main() {\n  float theta = uniTime * 0.00012 * PI;\n  float phi = (1.0 + sin(uniTime * 0.000842)) * .1 * PI;\n  float rho = 50.0;\n\n  float cosPhi = cos(phi);      // 1\n  float sinPhi = sin(phi);      // 0\n  float cosTheta = cos(theta);  // 1\n  float sinTheta = sin(theta);  // 0\n  \n  float camX = cosPhi * cosTheta;    // 1\n  float camY = cosPhi * sinTheta;    // 0\n  float camZ = sinPhi;               // 0\n\n  vec3 camVZ = -vec3(camX, camY, camZ);       // (-1,0,0)\n  vec3 camVX = vec3(sinTheta, -cosTheta, 0);  // (0,-1,0)\n  vec3 camVY = cross(camVZ, camVX);           // (0,0,1)\n\n  camX = camX * rho + uniLookX;\n  camY = camY * rho + uniLookY;\n  camZ = camZ * rho + uniLookZ;\n\n  camX = -0.0;\n  camY = -0.0;\n  camZ = -0.0;\n  \n  mat4 cameraMat = mat4(camVX.x, camVY.x, camVZ.x, 0.0,\n                        camVX.y, camVY.y, camVZ.y, 0.0,\n                        camVX.z, camVY.z, camVZ.z, 0.0,\n                        -camX,     -camY,   -camZ, 1.0);\n\n  vec4 pos = cameraMat * vec4(attPosition - vec3(uniLookX, uniLookY, uniLookZ), 1.0);\n  float zz = pos.z;\n  float xx = pos.x / uniWidth;\n  float yy = pos.y / uniHeight;\n  float w = ZOOM * DEPTH / (DEPTH + zz);\n  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);\n}                \n",
  "frag-unicolor": "precision mediump float;\n\nvoid main() {\n  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n"};
 
module.exports._ = _;
/**
 * @module world.terrain.edges
 * @see module:$
 * @see module:levels
 * @see module:tfw.webgl
 * @see module:world.terrain.edges

 */
});