goog.provide('animatejs.Scene');

goog.require('animatejs.Animation');



/**
 * Scene
 * @constructor
 * @export
 */
animatejs.Scene = function() {
  'use strict';
  this.sceneAnimations_ = [];
};


/**
 *
 * @param {number} at
 * @param {animatejs.Animation} animation
 * @export
 */
animatejs.Scene.prototype.add = function(at, animation) {
  'use strict';
  this.sceneAnimations_.push({
    at: at,
    animation: animation
  });
};
