goog.provide('animatejs.util.Playable');

goog.require('animatejs.util.IRequestAnimationFrame');
goog.require('animatejs.util.Listenable');



/**
 * Abstract control class for playable objects (Animation and Scene)
 * @constructor
 * @extends {animatejs.util.Listenable}
 * @export
 */
animatejs.util.Playable = function() {
  'use strict';
  animatejs.util.Playable.superClass_.constructor.call(this);

  /**
   * @private
   */
  this.state_ = animatejs.util.Playable.State.IDLE;

  /**
   * @private
   */
  this.loop_ = false;

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
  this.onFrame_ = goog.bind(this.onFrame_, this);

};
goog.inherits(animatejs.util.Playable, animatejs.util.Listenable);


/**
 * Current playable time
 * @type {number}
 * @protected
 */
animatejs.util.Playable.prototype.atTime = 0;


/**
 * @type {animatejs.util.IRequestAnimationFrame}
 * @private
 */
animatejs.util.Playable.prototype.requestFrame_ = animatejs.util;


/**
 * Enumeration of possible 'playable' objects states
 * @enum {number}
 * @export
 */
animatejs.util.Playable.State = {
  IDLE: 0,
  RUNNING: 1,
  PAUSED: 2
};


/**
 * @private
 */
animatejs.util.Playable.prototype.cancelBrowserFrame_ = function() {
  'use strict';
  if (this.frameHandle_) {
    this.requestFrame_.cancelAnimationFrame.call(window, this.frameHandle_);
  }
};


/**
 * Function starts playing the object at position in time
 * @export
 * @param {number=} opt_at optional start time
 * @return {animatejs.util.Playable}
 */
animatejs.util.Playable.prototype.play = function(opt_at) {
  'use strict';
  var state = this.state_;
  if (state === animatejs.util.Playable.State.RUNNING) {
    this.stop();
    this.play(opt_at);
  } else {
    this.state_ = animatejs.util.Playable.State.RUNNING;
    if (state === animatejs.util.Playable.State.IDLE) {
      this.atTime = opt_at || 0;
      this.dispatch('start');
    }

    if (goog.isNumber(opt_at)) {
      this.set(opt_at);
    }
  }

  this.lastFrameTs_ = animatejs.util.now();
  this.frameHandle_ = this.requestFrame_.requestAnimationFrame.call(
      /** @type {animatejs.util.IRequestAnimationFrame} */(window), this.onFrame_);
  return this;
};


/**
 * Function stops current 'playable' object
 * @export
 * @return {animatejs.util.Playable}
 */
animatejs.util.Playable.prototype.stop = function() {
  'use strict';
  this.atTime = 0;
  this.loop_ = false;
  this.state_ = animatejs.util.Playable.State.IDLE;
  this.cancelBrowserFrame_();
  this.dispatch('stop');
  return this;
};


/**
 * Function pauses the 'playable' object
 * @export
 * @return {animatejs.util.Playable}
 */
animatejs.util.Playable.prototype.pause = function() {
  'use strict';
  this.state_ = animatejs.util.Playable.State.PAUSED;
  this.cancelBrowserFrame_();
  this.dispatch('pause');
  return this;
};


/**
 * Function marks 'playable' as a looping
 * @export
 * @return {animatejs.util.Playable}
 */
animatejs.util.Playable.prototype.loop = function() {
  'use strict';
  this.loop_ = true;
  return this;
};


/**
 * Function sets 'playable' at provided time
 * @param {number} time
 * @return {animatejs.util.Playable}
 * @export
 */
animatejs.util.Playable.prototype.set = function(time) {
  'use strict';
  this.atTime = time;
  return this;
};


/**
 * Function returns true if 'playable' is running
 * @return {boolean}
 * @export
 */
animatejs.util.Playable.prototype.isRunning = function() {
  'use strict';
  return this.state_ === animatejs.util.Playable.State.RUNNING;
};


/**
 * Function returns true if 'playable' is paused
 * @return {boolean}
 * @export
 */
animatejs.util.Playable.prototype.isPaused = function() {
  'use strict';
  return this.state_ === animatejs.util.Playable.State.PAUSED;
};


/**
 * Function returns true if the 'playable' is looping
 * @return {boolean}
 * @export
 */
animatejs.util.Playable.prototype.isLooping = function() {
  'use strict';
  return this.loop_;
};


/**
 * Function returns current 'playable' time position
 * @return {number}
 * @export
 */
animatejs.util.Playable.prototype.getAtTime = function() {
  'use strict';
  return this.atTime;
};


/**
 * Function returns current playable state
 * @export
 * @return {animatejs.util.Playable.State}
 */
animatejs.util.Playable.prototype.getState = function() {
  'use strict';
  return this.state_;
};


/**
 * Function sets frame requester for the current animation
 * @param {animatejs.util.IRequestAnimationFrame} requester
 * @protected
 */
animatejs.util.Playable.prototype.setFrameRequester = function(requester) {
  'use strict';
  this.requestFrame_ = requester;
};


/**
 * Function handles browser animation frame
 * @param {number} frameTs
 * @protected
 */
animatejs.util.Playable.prototype.onFrame = function(frameTs) {
  'use strict';
  var frameTime = frameTs - this.lastFrameTs_;
  this.set(this.atTime + frameTime);
  this.lastFrameTs_ = frameTs;
};


/**
 * Handles browser frame and requests next one
 * @private
 */
animatejs.util.Playable.prototype.onFrame_ = function() {
  'use strict';
  this.onFrame(animatejs.util.now());
  if (this.isRunning()) {
    this.frameHandle_ = this.requestFrame_.requestAnimationFrame.call(
        /** @type {animatejs.util.IRequestAnimationFrame} */(window), this.onFrame_);
  }
};


/**
 * Function disposes the object
 * @protected
 */
animatejs.util.Playable.prototype.disposeInternal = function() {
  'use strict';
  this.stop();
  animatejs.util.Playable.superClass_.disposeInternal.call(this);
};

