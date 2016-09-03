/** @module world.terrain.faces */require( 'world.terrain.faces', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 "use strict";

var Levels = require("levels");
var WebGL = require("tfw.webgl");


var Faces = function( gl ) {
    this._gl = gl;
    this._prg = new WebGL.Program(gl, {
        vert: GLOBAL['vert'],
        frag: GLOBAL['frag']
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

    var arr = [];
    var alti = Levels[id].alti;

    var rows = alti.length;
    var cols = alti[0].length;

    alti.forEach(function (row, y) {
        row.forEach(function (z, x) {
            if ( z < 0 ) return;
            var zz;
            // Top
            arr = arr.concat(quad(
                x + 0, y + 0, z,
                x + 0, y + 1, z,
                x + 1, y + 1, z,
                x + 1, y + 0, z,
                r0, g0, b0, z
            ));
            // Front
            zz = height(alti, x, y - 1);
            if (zz < z) {
                arr = arr.concat(quad(
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
                arr = arr.concat(quad(
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
                arr = arr.concat(quad(
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
                arr = arr.concat(quad(
                    x + 1, y + 0, zz,
                    x + 1, y + 0, z,
                    x + 1, y + 1, z,
                    x + 1, y + 1, zz,
                    r2, g2, b2, z
                ));
            }
        });
    });
    console.info("[world] arr.length / 7=...", arr.length / 7);

    this._arrAttributes = new Float32Array( arr );
    this._bufAttributes = this._gl.createBuffer();
};


/**
 * @return void
 */
Faces.prototype.render = function( time, w, h ) {
    var gl = this._gl;
    var prg = this._prg;
    var bpe = this._arrAttributes.BYTES_PER_ELEMENT;

    prg.use();

    // Ne pas afficher les faces qui nous tournent le dos.
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

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
        prg.attribs.attPosition, 3, gl.FLOAT, false, 7 * bpe, 0);
    gl.enableVertexAttribArray(prg.attribs.attColor);
    gl.vertexAttribPointer(
        prg.attribs.attColor, 3, gl.FLOAT, false, 7 * bpe, 3 * bpe);
    gl.enableVertexAttribArray(prg.attribs.attThreshold);
    gl.vertexAttribPointer(
        prg.attribs.attThreshold, 1, gl.FLOAT, false, 7 * bpe, 6 * bpe);

    gl.enable(gl.DEPTH_TEST);
    // Lancer le dessin du triangle composé de 3 points.
    gl.drawArrays(gl.TRIANGLES, 0, this._arrAttributes.length / 7);
};


function height(alti, x, y) {
    if (y < 0 || y >= alti.length) return -2;
    var row = alti[y];
    if (x < 0 || x >= row.length) return -2;
    var h = row[x];
    if (h < 0) return -2;
    return h;
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


var GLOBAL = {
  "vert": "uniform float uniWidth;\nuniform float uniHeight;\nuniform float uniTime;\nuniform float uniLookX;\nuniform float uniLookY;\nuniform float uniLookZ;\nuniform float uniLookPhi;\nuniform float uniLookTheta;\nuniform float uniLookRho;\n\nattribute vec3 attPosition;\nattribute vec3 attColor;\nattribute float attThreshold;\n\nvarying vec3 varColor;\nvarying float varHeight;\nvarying float varThreshold;\n\nconst float DEPTH = 270.0;\nconst float ZOOM = 100000.0;\n\nconst float PI = 3.141592653589793;\n  \nvoid main() {\n  float theta = uniLookTheta;\n  float phi = uniLookPhi;\n  float rho = uniLookRho;\n  float lookX = uniLookX;\n  float lookY = uniLookY;\n  float lookZ = uniLookZ;\n\n  float cosPhi = cos(phi);      // 1\n  float sinPhi = sin(phi);      // 0\n  float cosTheta = cos(theta);  // 1\n  float sinTheta = sin(theta);  // 0\n  \n  float camX = cosPhi * cosTheta;    // 1\n  float camY = cosPhi * sinTheta;    // 0\n  float camZ = sinPhi;               // 0\n\n  vec3 camVZ = -vec3(camX, camY, camZ);       // (-1,0,0)\n  vec3 camVX = vec3(sinTheta, -cosTheta, 0);  // (0,-1,0)\n  vec3 camVY = cross(camVZ, camVX);           // (0,0,1)\n\n  camX = camX * rho + lookX;\n  camY = camY * rho + lookY;\n  camZ = camZ * rho + lookZ;\n\n  mat3 cameraMat = mat3(camVX.x, camVY.x, camVZ.x,\n                        camVX.y, camVY.y, camVZ.y,\n                        camVX.z, camVY.z, camVZ.z);\n\n  vec3 pos = cameraMat * (attPosition - vec3(camX, camY, camZ));\n  float zz = pos.z;\n  float xx = pos.x / uniWidth;\n  float yy = pos.y / uniHeight;\n  float w = ZOOM / (rho * (DEPTH + zz));\n  gl_Position = vec4(xx * w, yy * w, zz * 0.001, 1.0);\n  \n  varColor = attColor; \n  varHeight = attPosition.z;\n  varThreshold = attThreshold;\n}                \n",
  "frag": "precision mediump float;\n\nvarying vec3 varColor;\nvarying float varHeight;\nvarying float varThreshold;\n\n\nconst vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);\nconst vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);\n\nvoid main() {\n  float alpha;\n\n  gl_FragColor = vec4(varColor, 1.0);\n  if (varHeight < -1.0) {\n    if (varHeight > -1.1) {\n      gl_FragColor = BLUE;\n    } else {\n      alpha = -varHeight * .5;\n      gl_FragColor = mix( gl_FragColor, BLUE, alpha );\n    }\n  } else {\n    alpha = clamp((varHeight + 1.0) / 8.0, 0.0, 1.0);\n    gl_FragColor = mix( gl_FragColor, WHITE, alpha );\n  }\n\n  float diff = varThreshold - varHeight;\n  if (diff > 0.0 && diff < .2) {\n    gl_FragColor = vec4(\n      mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), (.2 - diff) * 5.0),\n      1.0);\n  }\n}\n"};
 
module.exports._ = _;
/**
 * @module world.terrain.faces
 * @see module:$
 * @see module:levels
 * @see module:tfw.webgl
 * @see module:world.terrain.faces

 */
});