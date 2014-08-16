goog.provide('animatejs.Animation');

goog.require('animatejs.KeyFrameList');
goog.require('animatejs.util');
goog.require('animatejs.util.IRequestAnimationFrame');
goog.require('animatejs.util.Listenable');
goog.require('animatejs.util.Playable');
goog.require('goog.object');



/**
 * Animation
 * @constructor
 * @extends {animatejs.util.Playable}
 * @param {Object} properties properties definition end initial values
 * @export
 */
animatejs.Animation = function(properties) {
  'use strict';

  animatejs.Animation.superClass_.constructor.call(this);

  /**
   * @type {animatejs.KeyFrameList}
   */
  this['keyFrames'] = new animatejs.KeyFrameList(goog.object.clone(properties));
  this['keyFrames'].addOnDisposeCallback(function() {
    this.destroy();
  }, this);

  /**
   * @type {Object}
   */
  this['properties'] = properties;

  /**
   * @type {Array.<string>}
   * @private
   */
  this.changedProperties_ = [];

  /**
   * @type {animatejs.Scene}
   * @private
   */
  this.parentScene_ = null;

};
goog.inherits(animatejs.Animation, animatejs.util.Playable);


/**
 * Function creates and adds key frame to the animation
 * @param {number} at
 * @param {Object} properties
 * @param {function(number):number=} opt_ease
 * @return {animatejs.KeyFrameList}
 * @export
 */
animatejs.Animation.prototype.keyFrame = function(at, properties, opt_ease) {
  'use strict';
  var keyFrame = new animatejs.KeyFrame(at, goog.object.clone(properties), opt_ease);
  this['keyFrames'].add(keyFrame);
  return this;
};


/**
 * function plays current animation
 * @export
 * @param {number=} opt_at optional start time
 *
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.play = function(opt_at) {
  'use strict';

  if (this['keyFrames'].getLength() <= 1) {
    throw new Error(''); //TODO: errorz!
  }

  animatejs.Animation.superClass_.play.call(this, opt_at);
  return this;
};


/**
 * Function sets animation at provided time. Time should be a values from the animation
 * time range between 0 and last key frame time. If the value is greater than the total
 * animation time it will be narrowed to the maximum animation time value i.e if last
 * key frame is at 500ms and you call set with 600 animation will be set to state at
 * 500ms.
 *
 * @param {number} animationTime
 * @export
 */
animatejs.Animation.prototype.set = function(animationTime) {
  'use strict';
  var head = this['keyFrames'].getHead(),
      keyFrame = this['keyFrames'].getHead();
  this.atTime = animationTime;
  while (keyFrame) {
    if (animationTime >= keyFrame['at']) {
      this.resolveKeyFrame_(keyFrame);
      break;
    }
    keyFrame = keyFrame['prev'];
  }

  if (animationTime >= head['at']) {
    if (!this.isLooping()) {
      if (this.isRunning()) {
        this.stop();
        this.dispatch('finish');
      }
      this.atTime = head['at'];
    } else {
      this.atTime = 0;
    }
  }
};


/**
 * @param {animatejs.KeyFrame} keyFrame
 * @private
 */
animatejs.Animation.prototype.resolveKeyFrame_ = function(keyFrame) {
  'use strict';
  var nextKeyFrame = keyFrame['next'],
      propList = this['keyFrames']['frameProperties'],
      i = propList.length,
      property,
      delta,
      value,
      progress;

  this.changedProperties_.length = 0;

  if (nextKeyFrame) {
    progress = (this.atTime - keyFrame['at']) / (nextKeyFrame['at'] - keyFrame['at']);
    progress = progress > 1 ? 1 : progress;
    if (goog.isFunction(nextKeyFrame['ease'])) {
      progress = nextKeyFrame['ease'](progress);
    }
    while (i--) {
      property = propList[i];
      delta = nextKeyFrame['data'][property] - keyFrame['data'][property];
      value = keyFrame['data'][property] +
          delta * progress;
      if (value !== this['properties'][property]) {
        this.changedProperties_.push(property);
      }
      this['properties'][property] = value;
    }
  } else {
    progress = 1;
    if (goog.isFunction(keyFrame['ease'])) {
      progress = keyFrame['ease'](progress);
    }
    while (i--) {
      property = propList[i];
      this['properties'][property] = keyFrame['data'][property] * progress;
      this.changedProperties_.push(property);
    }
  }

  this.dispatch('frame', this['properties'], this.changedProperties_, keyFrame);
};


/**
 * Function returns duration of the animation
 * @return {number}
 * @export
 */
animatejs.Animation.prototype.getDuration = function() {
  'use strict';
  return this['keyFrames'].getHead()['at'];
};


/**
 * Function destroys this obejcts. After calling destroy object
 * will not be usable but will be safetly disposed. This will stop
 * the animation and cleanup all attached listeners and keyframes.
 * @export
 */
animatejs.Animation.prototype.destroy = function() {
  'use strict';
  goog.dispose(this);
};


/**
 * Function manages object disposal, is handled by goog.dispose.
 * @protected
 */
animatejs.Animation.prototype.disposeInternal = function() {
  'use strict';
  this['keyFrames'].destroy();
  animatejs.Animation.superClass_.disposeInternal.call(this);
};


/**
 * Function sets provided scene as aniamteion's parent scene
 * @param {Object} scene
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.setParentScene = function(scene) {
  'use strict';
  this.parentScene_ = scene;
  return this;
};


/**
 * Function returns current animation's parent scene or null
 * @return {animatejs.Scene}
 */
animatejs.Animation.prototype.getParentScene = function() {
  'use strict';
  return this.parentScene_;
};

