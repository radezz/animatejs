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
 */
animatejs.Animation.prototype.play = function() {
  'use strict';
  if (!this.running_) {
    this.running_ = true;
    this.lastFrameTs_ = animatejs.util.now();
    this.frameHandle_ = animatejs.util.requestAnimationFrame.call(window, this.onBrowserFrame_);
    if (this.animationTime_ === 0 && !this.loop_) {
      this.dispatch('start');
    }
  }
};


/**
 * function stops current animation
 */
animatejs.Animation.prototype.stop = function() {
  'use strict';
  this.running_ = false;
  this.animationTime_ = 0;
  if (this.frameHandle_) {
    animatejs.util.cancelAnimationFrame.call(window, this.frameHandle_);
  }
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

  while (keyFrame) {
    if (animationTime >= keyFrame['at']) {
      this.resolveKeyFrame_(keyFrame);
      break;
    }
    keyFrame = keyFrame['prev'];
  }

  if (animationTime >= head['at']) {
    if (!this.loop_) {
      this.stop();
      this.dispatch('finish');
    } else {
      this.animationTime_ = 0;
    }
  }
};


/**
 * Function handles browser animation frame
 * @param {number} frameTs
 */
animatejs.Animation.prototype.onFrame = function(frameTs) {
  'use strict';
  var frameTime = frameTs - this.lastFrameTs_;
  this.animationTime_ += frameTime;
  this.set(this.animationTime_);
  this.lastFrameTs_ = frameTs;
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
      this['properties'][property] = keyFrame['data'][property] +
          delta * progress;
      if (delta !== 0) {
        this.changedProperties_.push(property);
      }
    }
  } else {
    progress = 1;
    if (goog.isFunction(keyFrame['ease'])) {
      progress = nextKeyFrame['ease'](progress);
    }
    while (i--) {
      property = propList[i];
      this['properties'][property] = keyFrame['data'][property] * progress;
      this.changedProperties_.push(property);
    }
  }

  this.dispatch('frame', this['properties'], this.changedProperties_);

};


/**
 * @protected
 */
animatejs.Animation.prototype.disposeInternal = function() {
  'use strict';
  this['keyFrames'].dispose();
  animatejs.Animation.superClass_.disposeInternal.call(this);
};


