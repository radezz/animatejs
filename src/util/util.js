goog.provide('animatejs.util');


/**
 * Helper for checking instanceof
 * @param {*} obj
 * @param {Function} ofType
 * @return {boolean}
 */
animatejs.util.instanceOf = function(obj, ofType) {
  'use strict';
  return obj instanceof ofType;
};


/**
 * Helper alias for typeof
 * @param {*} arg
 * @return {boolean}
 */
animatejs.util.typeofObject = function(arg) {
  'use strict';
  return typeof(arg) === 'object';
};



/**
 * Function returns current timestamp
 * @return {number}
 */
animatejs.util.now = (function() {
  'use strict';
  return goog.isFunction(Date.now) ? Date.now : function() {
    return (new Date()).getTime();
  };
}());


/**
 * requestAnimationFrame polyfil
 * @param {function(number)} onFrame
 * @return {number}
 */
animatejs.util.requestAnimationFrame = (function() {
  'use strict';
  var lastTime = 0,
      vendors = ['moz', 'webkit'],
      requestFrame = window.requestAnimationFrame,
      i = vendors.length;

  while (!requestFrame && i--) {
    requestFrame = window[vendors[i] + 'RequestAnimationFrame'];
  }

  if (requestFrame) {
    return requestFrame;
  } else {
    return function(callback) {
      var currTime = new Date().getTime(),
          timeToCall = Math.max(0, 16 - (currTime - lastTime)),
          id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
}());


/**
 * cancelAnimationFram shim
 * @param {number} frameId
 */
animatejs.util.cancelAnimationFrame = (function() {
  'use strict';
  var vendors = ['moz', 'webkit'],
      cancelFrame = window.cancelAnimationFrame,
      i = vendors.length;

  while (!cancelFrame && i--) {
    cancelFrame = window[vendors[i] + 'CancelAnimationFrame'];
  }

  return cancelFrame || window.clearTimeout;

}());


