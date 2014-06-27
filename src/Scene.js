goog.provide('animatejs.Scene');

goog.require('animatejs.Animation');
goog.require('animatejs.util.IRequestAnimationFrame');
goog.require('animatejs.util.Playable');



/**
 * Scene
 * @constructor
 * @extends {animatejs.util.Playable}
 * @export
 */
animatejs.Scene = function() {
  'use strict';
  animatejs.Scene.superClass_.constructor.call(this);
  this.sceneAnimations_ = [];
};
goog.inherits(animatejs.Scene, animatejs.util.Playable);


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
