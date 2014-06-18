goog.provide('animatejs.Animation');

goog.require('animatejs.KeyFrameList');
goog.require('animatejs.util');
goog.require('animatejs.util.Listenable');
goog.require('goog.object');



/**
 * Animation
 * @constructor
 * @extends {animatejs.util.Listenable}
 * @param {Object} properties properties definition end initial values
 * @param {Object=} opt_options
 * @export
 */
animatejs.Animation = function(properties, opt_options) {
  'use strict';
  var options = opt_options || {};

  animatejs.Animation.superClass_.constructor.call(this);

  /**
   * @type {animatejs.KeyFrameList}
   */
  this['keyFrames'] = new animatejs.KeyFrameList(goog.object.clone(properties), options);

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
   * @type {number}
   * @private
   */
  this.animationTime_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.frameHandle_ = null;

  /**
   * @type {number}
   * @private
   */
  this.lastFrameTs_ = null;

  /**
   * @type {boolean}
   * @private
   */
  this.loop_ = false;

  /**
   * @type {boolean}
   * @private
   */
  this.running_ = false;

  this.onBrowserFrame_ = goog.bind(this.onBrowserFrame_, this);

};
goog.inherits(animatejs.Animation, animatejs.util.Listenable);


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
  var keyFrame = new animatejs.KeyFrame(at, properties, opt_ease);
  this['keyFrames'].add(keyFrame);
  return this;
};


/**
 * @private
 * TODO solve high res timestamp
 */
animatejs.Animation.prototype.onBrowserFrame_ = function() {
  'use strict';
  this.onFrame(animatejs.util.now());
  if (this.running_) {
    this.frameHandle_ = animatejs.util.requestAnimationFrame.call(window, this.onBrowserFrame_);
  }
};


/**
 * function plays current animation
 * @export
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.play = function() {
  'use strict';

  if (this['keyFrames'].getLength() <= 1) {
    throw new Error(''); //TODO: errorz!
  }

  if (!this.running_) {
    this.running_ = true;
    this.lastFrameTs_ = animatejs.util.now();
    this.frameHandle_ = animatejs.util.requestAnimationFrame.call(window, this.onBrowserFrame_);
    if (this.animationTime_ === 0 && !this.loop_) {
      this.dispatch('start');
    }
  } else {
    this.stop();
    this.play();
  }
  return this;
};


/**
 * function stops current animation
 * @export
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.stop = function() {
  'use strict';
  this.pause();
  this.animationTime_ = 0;
  this.loop_ = false;
  return this;
};


/**
 * Function pauses the animation
 * @export
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.pause = function() {
  'use strict';
  this.running_ = false;
  if (this.frameHandle_) {
    animatejs.util.cancelAnimationFrame.call(window, this.frameHandle_);
  }
  return this;
};


/**
 * Function marks animation as a looping animation
 * @export
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.loop = function() {
  'use strict';
  this.loop_ = true;
  return this;
};


/**
 * Function sets animation at provided time
 * @param {number} animationTime
 * @export
 */
animatejs.Animation.prototype.set = function(animationTime) {
  'use strict';
  var head = this['keyFrames'].getHead(),
      keyFrame = this['keyFrames'].getHead();
  this.animationTime_ = animationTime;
  while (keyFrame) {
    if (animationTime >= keyFrame['at']) {
      this.resolveKeyFrame_(keyFrame);
      break;
    }
    keyFrame = keyFrame['prev'];
  }

  if (animationTime >= head['at']) {
    if (!this.loop_) {
      if (this.running_) {
        this.stop();
        this.dispatch('finish');
      }
      this.animationTime_ = head['at'];
    } else {
      this.animationTime_ = 0;
    }
  }
};


/**
 * Function returns true if animation is running
 * @return {boolean}
 * @export
 */
animatejs.Animation.prototype.isRunning = function() {
  'use strict';
  return this.running_;
};


/**
 * Function handles browser animation frame
 * @param {number} frameTs
 * @export
 */
animatejs.Animation.prototype.onFrame = function(frameTs) {
  'use strict';
  var frameTime = frameTs - this.lastFrameTs_;
  this.set(this.animationTime_ + frameTime);
  this.lastFrameTs_ = frameTs;
};


/**
 * Function returns current animation time position
 * @return {number}
 * @export
 */
animatejs.Animation.prototype.getAtTime = function() {
  'use strict';
  return this.animationTime_;
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
    progress = (this.animationTime_ - keyFrame['at']) / (nextKeyFrame['at'] - keyFrame['at']);
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
 * Function destroys this obejcts
 * @export
 */
animatejs.Animation.prototype.destroy = function() {
  'use strict';
  goog.dispose(this);
};


/**
 * @protected
 */
animatejs.Animation.prototype.disposeInternal = function() {
  'use strict';
  if (this.running_) {
    this.stop();
  }
  this['keyFrames'].destroy();
  animatejs.Animation.superClass_.disposeInternal.call(this);
};


