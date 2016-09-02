var KEYS = [];


document.addEventListener('keydown', function(evt) {
    KEYS[evt.keyCode] = true;
    console.log(evt.keyCode);
});


document.addEventListener('keyup', function(evt) {
    KEYS[evt.keyCode] = false;
});


exports.test = function(keyCode) {
    return KEYS[keyCode];
};
