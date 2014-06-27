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
   * @type {?number}
   * @private
   */
  this.frameHandle_ = null;

  /**
   * @type {?number}
   * @private
   */
  this.lastFrameTs_ = null;

  /**
   * @private
   */
  this.onBrowserFrame_ = goog.bind(this.onBrowserFrame_, this);

};
goog.inherits(animatejs.Animation, animatejs.util.Playable);


/**
 * @type {animatejs.util.IRequestAnimationFrame}
 * @private
 */
animatejs.Animation.prototype.requestFrame_ = animatejs.util;


/**
 * Function sets new frame requester (i.e Scene)
 * @param {aniamtejs.util.IRequestAnimationFrame} requester
 */
animatejs.Animation.prototype.setFrameRequester = function(requester) {
  'use strict';
  this.requestFrame_ = requester;
};


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
  if (this.isRunning()) {
    this.frameHandle_ = this.requestFrame_.requestAnimationFrame.call(window, this.onBrowserFrame_);
  }
};


/**
 * function plays current animation
 * @export
 * @param {number=} opt_at optional start time
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.play = function(opt_at) {
  'use strict';

  if (this['keyFrames'].getLength() <= 1) {
    throw new Error(''); //TODO: errorz!
  }

  animatejs.Animation.superClass_.play.call(this, opt_at);
  this.lastFrameTs_ = animatejs.util.now();
  this.frameHandle_ = this.requestFrame_.requestAnimationFrame.call(window, this.onBrowserFrame_);
  return this;
};


/**
 * Function stops the animation
 * @export
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.stop = function() {
  'use strict';
  animatejs.Animation.superClass_.stop.call(this);
  this.cancelBrowserFrame_();
  return this;
};


/**
 * @private
 */
animatejs.Animation.prototype.cancelBrowserFrame_ = function() {
  'use strict';
  if (this.frameHandle_) {
    this.requestFrame_.cancelAnimationFrame.call(window, this.frameHandle_);
  }
};


/**
 * Function pauses the animation
 * @export
 * @return {animatejs.Animation}
 */
animatejs.Animation.prototype.pause = function() {
  'use strict';
  animatejs.Animation.superClass_.pause.call(this);
  this.cancelBrowserFrame_();
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
 * Function handles browser animation frame
 * @param {number} frameTs
 * @export
 */
animatejs.Animation.prototype.onFrame = function(frameTs) {
  'use strict';
  var frameTime = frameTs - this.lastFrameTs_;
  this.set(this.atTime + frameTime);
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
  this.stop();
  this['keyFrames'].destroy();
  animatejs.Animation.superClass_.disposeInternal.call(this);
};


