/* jshint ignore:start */
goog.provide('animatejs.util.IRequestAnimationFrame');



/**
 * Interface describing requesting animation frame
 * @interface
 */
animatejs.util.IRequestAnimationFrame = function() {};


/**
 * Function requests animation frame
 * @param {Function} fn
 * @return {number} frameHandle
 */
animatejs.util.IRequestAnimationFrame.prototype.requestAnimationFrame = function(fn) {};


/**
 * Function cancels previously requested animation frame
 * @param {number} frameHandle
 */
animatejs.util.IRequestAnimationFrame.prototype.cancelAnimationFrame = function(frameHandle) {};


/* jshint ignore:end */
