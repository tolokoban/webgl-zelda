/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

window.require = function() {
    var modules = {};
    var definitions = {};
    var nodejs_require = typeof window.require === 'function' ? window.require : null;

    var f = function(id, body) {
        if( id.substr( 0, 7 ) == 'node://' ) {
            // Calling for a NodeJS module.
            if( !nodejs_require ) {
                throw Error( "[require] NodeJS is not available to load module `" + id + "`!" );
            }
            return nodejs_require( id.substr( 7 ) );
        }

        if( typeof body === 'function' ) {
            definitions[id] = body;
            return;
        }
        var mod;
        body = definitions[id];
        if (typeof body === 'undefined') {
            var err = new Error("Required module is missing: " + id);   
            console.error(err.stack);
            throw err;
        }
        mod = modules[id];
        if (typeof mod === 'undefined') {
            mod = {exports: {}};
            var exports = mod.exports;
            body(f, mod, exports);
            modules[id] = mod.exports;
            mod = mod.exports;
            //console.log("Module initialized: " + id);
        }
        return mod;
    };
    return f;
}();
function addListener(e,l) {
    if (window.addEventListener) {
        window.addEventListener(e,l,false);
    } else {
        window.attachEvent('on' + e, l);
    }
};

addListener(
    'DOMContentLoaded',
    function() {
        document.body.parentNode.$data = {};
        // Attach controllers.
        APP = require('page.index');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});
var W = require('x-widget');
        W('mini-map', 'mini-map', {})
        W('wdg.button0', 'wdg.button', {
            text: "Déselectionner",
            wide: "true",
            type: "secondary"})
        W('wdg.button1', 'wdg.button', {
            text: "Mer",
            value: "sea"})
        W('wdg.button2', 'wdg.button', {
            text: "Plage",
            value: "beach"})
        W('wdg.button3', 'wdg.button', {
            text: "Monter",
            value: "up"})
        W('wdg.button4', 'wdg.button', {
            text: "Descendre",
            value: "down"})
        W('wdg.button5', 'wdg.button', {
            text: "Adoucir le relief",
            value: "smooth",
            wide: "true",
            type: "primary"})
        W.bind('wdg.button0',{"action":{"S":["onUnselect"]}});
        W.bind('wdg.button1',{"action":{"S":["onBrush"]}});
        W.bind('wdg.button2',{"action":{"S":["onBrush"]}});
        W.bind('wdg.button3',{"action":{"S":["onBrush"]}});
        W.bind('wdg.button4',{"action":{"S":["onBrush"]}});
        W.bind('wdg.button5',{"action":{"S":["onBrush"]}});
    }
);
