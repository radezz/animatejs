goog.provide('animatejs.Scene');

goog.require('animatejs.Animation');
goog.require('animatejs.util.IRequestAnimationFrame');
goog.require('animatejs.util.Playable');



/**
 * Scene
 * @constructor
 * @extends {animatejs.util.Playable}
 * @implements {aniamtejs.util.IRequestAnimationFrame}
 * @export
 */
animatejs.Scene = function() {
  'use strict';
  animatejs.Scene.superClass_.constructor.call(this);

  /**
   * @private
   */
  this.sceneAnimations_ = [];

  /**
   * @private
   */
  this.frameHandlers_ = [];

  /**
   * @private
   */
  this.browserFrameHandle_ = null;

  this.requestAnimationFrame = goog.bind(this.requestAnimationFrame, this);
  this.cancelAnimationFrame = goog.bind(this.cancelAnimationFrame, this);
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
  animation.setFrameRequester(this);
  this.sceneAnimations_.push({
    at: at,
    animation: animation
  });
};


/**
 * Function remove animation from current scene
 * @param {animatejs.Animation} animation
 * @export
 */
animatejs.Scene.prototype.remove = function(animation) {
  'use strict';
  var i = this.sceneAnimations_.length,
      entryAnimation;
  while (i--) {
    entryAnimation = this.sceneAnimations_[i].animation;
    if (entryAnimation === animation) {
      if (entryAnimation.isRunning()) {
        entryAnimation.stop();
      }
      entryAnimation.setFrameRequester(animatejs.util);
      this.sceneAnimations_.splice(i, 1);
      return;
    }
  }
};


/**
 * Function returns list of all animation entries
 * @return {Array}
 * @export
 */
animatejs.Scene.prototype.getAnimationEntries = function() {
  'use strict';
  return this.sceneAniations_;
};


/**
 * Function requests animation frame from scene
 * @param {Function} onFrame
 * @return {number}
 * @protected
 */
animatejs.Scene.prototype.requestAnimationFrame = function(onFrame) {
  'use strict';
  return this.frameHandlers_.push(onFrame);
};


/**
 * Function cancels given frameHandler
 * @param {number} frameHandler
 * @protected
 */
animatejs.Scene.prototype.cancelAnimationFrame = function(frameHandler) {
  'use strict';
  if (this.frameHandlers_[frameHandler]) {
    this.frameHandlers_.splice(frameHandler, 1);
  }
};


/**
 * Function starts playing scene animations
 * @param {number=} opt_at
 * @export
 */
animatejs.Scene.prototype.play = function(opt_at) {
  'use strict';
  animatejs.Scene.superClass_.play.call(this, opt_at);
};


