/** @module world.terrain.water */require( 'world.terrain.water', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
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


var GLOBAL = {
  "vert": "uniform float uniWidth;\nuniform float uniHeight;\nuniform float uniLookX;\nuniform float uniLookY;\nuniform float uniLookZ;\nuniform float uniLookPhi;\nuniform float uniLookTheta;\nuniform float uniLookRho;\n\nattribute vec3 attPosition;\nattribute float attU;\nattribute float attV;\nattribute float attT;\n\nvarying vec3 varColor;\nvarying vec3 varInfo;\n\nconst float DEPTH = 270.0;\nconst float ZOOM = 100000.0;\n\nconst float PI = 3.141592653589793;\n  \nvoid main() {\n  float theta = uniLookTheta;\n  float phi = uniLookPhi;\n  float rho = uniLookRho;\n  float lookX = uniLookX;\n  float lookY = uniLookY;\n  float lookZ = uniLookZ;\n\n  float cosPhi = cos(phi);      // 1\n  float sinPhi = sin(phi);      // 0\n  float cosTheta = cos(theta);  // 1\n  float sinTheta = sin(theta);  // 0\n  \n  float camX = cosPhi * cosTheta;    // 1\n  float camY = cosPhi * sinTheta;    // 0\n  float camZ = sinPhi;               // 0\n\n  vec3 camVZ = -vec3(camX, camY, camZ);       // (-1,0,0)\n  vec3 camVX = vec3(sinTheta, -cosTheta, 0);  // (0,-1,0)\n  vec3 camVY = cross(camVZ, camVX);           // (0,0,1)\n\n  camX = camX * rho + lookX;\n  camY = camY * rho + lookY;\n  camZ = camZ * rho + lookZ;\n\n  mat3 cameraMat = mat3(camVX.x, camVY.x, camVZ.x,\n                        camVX.y, camVY.y, camVZ.y,\n                        camVX.z, camVY.z, camVZ.z);\n\n  vec3 pos = cameraMat * (attPosition - vec3(camX, camY, camZ));\n  float zz = pos.z;\n  float xx = pos.x / uniWidth;\n  float yy = pos.y / uniHeight;\n  float w = ZOOM / (rho * (DEPTH + zz));\n  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);\n  \n  varInfo = vec3(attU, attV, attT);\n}                \n",
  "frag": "precision mediump float;\n\nuniform float uniTimeFrag;\n\nvarying vec3 varColor;\nvarying vec3 varInfo;\n\nconst vec4 TRANSPARENT = vec4(0.0, 0.0, 1.0, 0.0);\nconst vec4 WHITE = vec4(.4, .8, 1.0, 1.0);\nconst float DUR = 1800.0;\n\nvoid main() {\n  float u = varInfo.x;\n  float v = varInfo.y;\n  float t = varInfo.z;\n\n  if (uniTimeFrag < t || t + DUR < uniTimeFrag) {\n    gl_FragColor = TRANSPARENT;\n    return;\n  }\n\n  float r = sqrt(u*u + v*v);\n  float r2 = (uniTimeFrag - t) / DUR;\n\n  if (r2 > r && r > 0.8 * r2) {\n    gl_FragColor = vec4(WHITE.rgb, mix(.5, .0, r2));    \n  } else {\n    gl_FragColor = TRANSPARENT;    \n  }\n}\n"};
 
module.exports._ = _;
/**
 * @module world.terrain.water
 * @see module:$
 * @see module:levels
 * @see module:tfw.webgl
 * @see module:world.terrain.water

 */
});