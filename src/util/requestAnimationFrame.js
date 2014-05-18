goog.provide('animatejs.util.requestAnimationFrame');


/**
 * requestAnimationFrame shim
 */
(function() {
  'use strict';
  var lastTime = 0,
      vendors = ['webkit', 'moz'];
  animatejs.util.requestAnimationFrame = window.requestAnimationFrame;
  animatejs.util.cancelAnimationFrame = window.cancelAnimationFrame;
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    animatejs.util.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    animatejs.util.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!animatejs.util.requestAnimationFrame) {
    animatejs.util.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!animatejs.util.cancelAnimationFrame) {
    animatejs.util.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());
