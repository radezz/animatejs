goog.provide('animatejs.Scene');

goog.require('animatejs.Animation');
goog.require('animatejs.util');
goog.require('animatejs.util.IRequestAnimationFrame');
goog.require('animatejs.util.Playable');
goog.require('animatejs.util.error');



/**
 * Scene
 * @constructor
 * @extends {animatejs.util.Playable}
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


};
goog.inherits(animatejs.Scene, animatejs.util.Playable);


/**
 * @type {Object}
 * @access private
 */
animatejs.Scene.DUMMY_FRAME_REQUEST = {
  'requestAnimationFrame': goog.nullFunction,
  'cancelAnimationFrame': goog.nullFunction
};


/**
 * Function returns index of the animation in animation registry
 * @param {animatejs.Animation} animation
 * @return {number}
 * @private
 */
animatejs.Scene.prototype.indexOf_ = function(animation) {
  'use strict';
  var i = this.sceneAnimations_.length;
  while (i--) {
    if (this.sceneAnimations_[i]['animation'] === animation) {
      return i;
    }
  }
  return -1;
};


/**
 * Function returns true if provided animation exists in
 * scene's registry
 * @param {animatejs.Animation} animation
 * @return {boolean}
 * @export
 */
animatejs.Scene.prototype.has = function(animation) {
  'use strict';
  return this.indexOf_(animation) !== -1;
};


/**
 *
 * @param {number} at
 * @param {animatejs.Animation} animation
 * @export
 */
animatejs.Scene.prototype.add = function(at, animation) {
  'use strict';
  var that = this,
      parentScene,
      endTime;

  if (!goog.isNumber(at)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.NUMBER));
  }

  if (!animatejs.util.instanceOf(animation, animatejs.Animation)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(2, 'Animation'));
  }

  if (this.has(animation)) {
    throw new Error('cannot add same animation twice');
  } else {
    //if animation is already a member of other scene remove it from there
    parentScene = animation.getParentScene();
    if (parentScene && parentScene !== this) {
      parentScene.remove(animation);
    }

    animation.setParentScene(this);
    animation.setFrameRequester(/** @type {animatejs.util.IRequestAnimationFrame} */
        (animatejs.Scene.DUMMY_FRAME_REQUEST));
    animation.addOnDisposeCallback(function() {
      if (that.has(animation)) {
        that.remove(animation);
      }
    });

    endTime = at + animation.getDuration();
    if (endTime > this.duration) {
      this.duration = endTime;
    }

    this.sceneAnimations_.push({
      'at': at,
      'end': animation.isLooping() ? Number.POSITIVE_INFINITY : endTime,
      'animation': animation
    });
  }
};


/**
 * Function remove animation from current scene
 * @param {animatejs.Animation} animation
 * @export
 */
animatejs.Scene.prototype.remove = function(animation) {
  'use strict';
  var i = this.indexOf_(animation);
  if (i !== -1) {
    if (animation.isRunning()) {
      animation.stop();
    }
    animation.setParentScene(null);
    animation.setFrameRequester(/** @type {animatejs.util.IRequestAnimationFrame} */
        (animatejs.util));
    this.sceneAnimations_.splice(i, 1);
  }
};


/**
 * Function returns list of all animation entries
 * @return {Array}
 * @export
 */
animatejs.Scene.prototype.getAnimationEntries = function() {
  'use strict';
  return this.sceneAnimations_;
};


/**
 * Function handles time provided by playable
 * @param {number} sceneTime
 * @export
 */
animatejs.Scene.prototype.onTime = function(sceneTime) {
  'use strict';
  var animationEntry,
      animationTime,
      animation,
      isLastFrame,
      i,
      l;

  isLastFrame = sceneTime >= this.duration;
  this.atTime = isLastFrame ? this.duration : sceneTime;
  for (i = 0, l = this.sceneAnimations_.length; i < l; i++) {
    animationEntry = this.sceneAnimations_[i];
    if (sceneTime >= animationEntry['at']) {
      animation = animationEntry['animation'];
      if (animation.isLooping()) {
        animationTime = (sceneTime - animationEntry['at']) % animation.getDuration();
      } else {
        animationTime = sceneTime - animationEntry['at'];
      }

      if (animation.isRunning()) {
        animation.set(animationTime);
      } else if (sceneTime < animationEntry['end']) {
        animation.play(animationTime);
      }
    }
  }

  if (isLastFrame) {
    this.stop();
  }

};


/**
 * Function stops entire scene (all animations)
 * @return {animatejs.Scene}
 * @export
 */
animatejs.Scene.prototype.stop = function() {
  'use strict';
  var i = this.sceneAnimations_.length,
      animationEntry,
      animation;
  while (i--) {
    animationEntry = this.sceneAnimations_[i];
    animation = animationEntry['animation'];
    if (animation.isRunning()) {
      animation.stop();
      if (animationEntry['end'] === Number.POSITIVE_INFINITY) {
        animation.loop();
      }
    }
  }
  animatejs.Scene.superClass_.stop.call(this);
  return this;
};


/**
 * Function pauses animations in current scene
 * @override
 * @export
 */
animatejs.Scene.prototype.pause = function() {
  'use strict';
  var i = this.sceneAnimations_.length,
      animation;
  while (i--) {
    animation = this.sceneAnimations_[i]['animation'];
    if (animation.isRunning()) {
      animation.pause();
    }
  }
  return animatejs.Scene.superClass_.pause.call(this);
};


/**
 * Function releases objects references
 * @protected
 * @access private
 */
animatejs.Scene.prototype.disposeInternal = function() {
  'use strict';
  animatejs.Scene.superClass_.disposeInternal.call(this);
  var i = this.sceneAnimations_.length;
  while (i--) {
    this.remove(this.sceneAnimations_[i]['animation']);
  }
};


/**
 * Function destroys the objects and clears
 * all animation entries
 * @export
 */
animatejs.Scene.prototype.destroy = function() {
  'use strict';
  goog.dispose(this);
};


/**
 * @typedef {{
 *    at: (number),
 *    end: (number),
 *    animation: (animatejs.Animation)
 * }}
 * @name animatejs.Scene.AnimationEntry
 * @property {number} at
 * @property {number} end
 * @property {animatejs.Animation} animation
 */
animatejs.Scene.AnimationEntry; // jshint ignore:line



