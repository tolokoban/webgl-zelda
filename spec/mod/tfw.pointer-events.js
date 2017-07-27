require("tfw.pointer-events",function(t,e,o){function a(t){var e=this;this._slots={},this._eventListeners=[],Object.defineProperty(a.prototype,"element",{value:t,writable:!1,configurable:!0,enumerable:!0}),n.call(e,t,"touchstart",function(o){o.preventDefault(),i.touchDevice||(i.touchDevice=!0,document.body.removeEventListener("mousedown",l,!0),document.body.removeEventListener("mousemove",p,!0),document.body.removeEventListener("mouseup",v,!0));var a=e._slots;1==o.touches.length&&(i.rect=t.getBoundingClientRect(),i.bodyMoveX=o.touches[0].clientX,i.bodyMoveY=o.touches[0].clientY,i.bodyDownX=o.touches[0].clientX,i.bodyDownY=o.touches[0].clientY,i.targetX=o.touches[0].clientX-i.rect.left,i.targetY=o.touches[0].clientY-i.rect.top,i.time=Date.now(),a.down&&a.down({action:"down",target:t,x:i.targetX,y:i.targetY,stopPropagation:o.stopPropagation.bind(o),preventDefault:o.preventDefault.bind(o)}))}),n.call(e,t,"touchmove",function(o){o.preventDefault();var a=i.bodyMoveX,n=i.bodyMoveY;i.bodyMoveX=o.touches[0].clientX,i.bodyMoveY=o.touches[0].clientY;var r=e._slots;r.drag&&r.drag({action:"drag",target:t,x0:i.targetX,y0:i.targetY,x:i.bodyMoveX-i.rect.left,y:i.bodyMoveY-i.rect.top,dx:i.bodyMoveX-i.bodyDownX,dy:i.bodyMoveY-i.bodyDownY,vx:i.bodyMoveX-a,vy:i.bodyMoveY-n,stopPropagation:o.stopPropagation.bind(o),preventDefault:o.preventDefault.bind(o)})}),n.call(e,t,"touchend",function(t){t.preventDefault();var o=e._slots,a=i.bodyMoveX-i.bodyDownX,n=i.bodyMoveY-i.bodyDownY;if(o.up&&o.up({action:"up",target:e.element,x:i.bodyMoveX-i.rect.left,y:i.bodyMoveY-i.rect.top,dx:a,dy:n,stopPropagation:t.stopPropagation.bind(t),preventDefault:t.preventDefault.bind(t)}),a*a+n*n<256){var r=Date.now();i.lastTapTime>0&&(o.doubletap&&r-i.lastTapTime<400?o.doubletap({action:"doubletap",target:i.bodyTarget,x:i.bodyMoveX-i.rect.left,y:i.bodyMoveY-i.rect.top,stopPropagation:t.stopPropagation.bind(t),preventDefault:t.preventDefault.bind(t)}):i.lastTapTime=0),o.tap&&0==i.lastTapTime&&(t.stopPropagation(),t.preventDefault(),o.tap({action:"tap",target:i.bodyTarget,x:i.bodyMoveX-i.rect.left,y:i.bodyMoveY-i.rect.top,stopPropagation:t.stopPropagation.bind(t),preventDefault:t.preventDefault.bind(t)})),i.lastTapTime=r}}),n.call(e,t,"mousedown",function(o){if(!i.touchDevice){var a=e._slots,n=t.getBoundingClientRect();i.target=e,i.targetX=o.clientX-n.left,i.targetY=o.clientY-n.top,a.down&&a.down({action:"down",target:i.bodyTarget,x:i.targetX,y:i.targetY,stopPropagation:o.stopPropagation.bind(o),preventDefault:o.preventDefault.bind(o)})}}),n.call(e,t,"mousemove",function(o){var a=e._slots;if(a.move){var n=t.getBoundingClientRect(),r=o.target.getBoundingClientRect();a.move({target:t,action:"move",x:o.offsetX+r.left-n.left,y:o.offsetY+r.top-n.top})}}),Object.defineProperty(this,"element",{value:t,writable:!0,configurable:!0,enumerable:!0})}function n(t,e,o,a){t.addEventListener(e,o,a),this._eventListeners.push([t,e,o,a])}var r=function(){function e(){return a(o,arguments)}var o={en:{}},a=t("$").intl;return e.all=o,e}(),d="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll",i={touchDevice:!1,target:null,targetX:0,targetY:0,bodyDownX:0,bodyDownY:0,bodyMoveX:-1,bodyMoveY:-1,bodyMoveLastX:-1,bodyMoveLastY:-1,onDrag:null,lastTapTime:0},l=function(t){i.touchDevice||(i.bodyDownX=t.pageX,i.bodyDownY=t.pageY,i.bodyMoveX=t.pageX,i.bodyMoveY=t.pageY,i.bodyMoveLastX=t.pageX,i.bodyMoveLastY=t.pageY,i.bodyTarget=t.target,i.bodyButton=t.button)},p=function(t){if(!i.touchDevice&&i.target&&(t.stopPropagation(),t.preventDefault(),i.bodyMoveLastX=i.bodyMoveX,i.bodyMoveLastY=i.bodyMoveY,i.bodyMoveX=t.pageX,i.bodyMoveY=t.pageY,i.target)){var e=i.target._slots;"function"==typeof e.drag&&e.drag({action:"drag",target:i.target.element,x0:i.targetX,y0:i.targetY,x:i.targetX+i.bodyMoveX-i.bodyDownX,y:i.targetY+i.bodyMoveY-i.bodyDownY,dx:i.bodyMoveX-i.bodyDownX,dy:i.bodyMoveY-i.bodyDownY,vx:i.bodyMoveX-i.bodyMoveLastX,vy:i.bodyMoveY-i.bodyMoveLastY,button:i.bodyButton})}},v=function(t){if(!i.touchDevice&&i.target){t.stopPropagation(),t.preventDefault();var e=Date.now(),o=i.target._slots,a=t.pageX-i.bodyDownX,n=t.pageY-i.bodyDownY;o.up&&o.up({action:"up",target:i.bodyTarget,x:i.targetX+a,y:i.targetY+n,dx:a,dy:n}),a*a+n*n<1024&&(i.lastTapTime>0&&(o.doubletap&&e-i.lastTapTime<400?o.doubletap({action:"doubletap",target:i.bodyTarget,x:i.targetX+a,y:i.targetY+n}):i.lastTapTime=0),o.tap&&0==i.lastTapTime&&o.tap({action:"tap",target:i.bodyTarget,x:i.targetX+a,y:i.targetY+n}),i.lastTapTime=e),delete i.target}};document.body.addEventListener("mousedown",l,!0),document.body.addEventListener("mousemove",p,!0),document.body.addEventListener("mouseup",v,!0),a.prototype.on=function(t,e){var o=this,a=this._slots;return"function"==typeof e&&(a[t]=e),"wheel"==t&&n.call(o,this.element,d,function(t){var e=o.element.getBoundingClientRect();a.wheel({target:i.bodyTarget,action:"wheel",delta:t.deltaY,x:t.clientX-e.left,y:t.clientY-e.top,stopPropagation:t.stopPropagation.bind(t),preventDefault:t.preventDefault.bind(t)})}),this},a.prototype.off=function(){this._eventListeners.forEach(function(t){var e=t[0],o=t[1],a=t[2],n=t[3];e.removeEventListener(o,a,n)})},e.exports=a,e.exports._=r});
//# sourceMappingURL=tfw.pointer-events.js.map