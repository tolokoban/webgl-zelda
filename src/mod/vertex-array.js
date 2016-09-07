/**
 * @module vertex-array
 *
 * @description
 * Instead of using gl.drawArray(), you can use gl.drawElement() which
 * prevent from defining the same vertices twice.
 *
 * @example
 * var va = require('vertex-array');
 * var elems = [];
 * elems.push(
 *   va.add( 0, 0 ),
 *   va.add( 0, 1 ),
 *   va.add( 1, 1 ),
 *   va.add( 1, 1 ),
 *   va.add( 1, 0 ),
 *   va.add( 0, 0 )
 * );
 * // va.vertexCount == 4
 * // va.attribCount == 2
 */


var VertexArray = function() {
    this._vertexCount = 0;
    this._attribCount = -1;
    this._mapVert = {};
    this._arrVert = [];
    this._arrElem = [];
};


/**
 * @return void
 */
VertexArray.prototype.toBufferArrays = function() {
    return {
        vert: new Float32Array( this._arrVert ),
        elem: new Uint16Array( this._arrElem )
    };
};


/**
 * Add a vertex by giving all its attributes.
 *
 * @return Index of the vertex.
 */
VertexArray.prototype.add = function() {
    var arr = [].slice.call( arguments );    
    if (this._attribCount == -1) {
        this._attribCount = arr.length;
    }
    var key = arr.join(',');
    var idx = this._mapVert[key];
    if (typeof idx === 'number') {
        this._arrElem.push( idx );
        return idx;
    }
    idx = this._arrVert.length / this._attribCount;
    this._arrVert.push.apply(this._arrVert, arr);
    this._mapVert[key] = idx;
    this._arrElem.push( idx );
    this._vertexCount = idx + 1;
    return idx;
};


Object.defineProperty( VertexArray.prototype, 'vertexCount', {
    get: function() { return this._vertexCount; },
    set: function(v) {},
    configurable: true,
    enumerable: true
});

Object.defineProperty( VertexArray.prototype, 'attribCount', {
    get: function() { return this._attribCount; },
    set: function(v) {},
    configurable: true,
    enumerable: true
});

module.exports = VertexArray;
