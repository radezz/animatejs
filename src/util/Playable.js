goog.provide('animatejs.util.Playable');

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
};
goog.inherits(animatejs.util.Playable, animatejs.util.Listenable);


/**
 * Current playable time
 * @type {number}
 * @protected
 */
animatejs.util.Playable.prototype.atTime = 0;


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
  return this;
};


/**
 * Function marks 'playable' as a looping
 * @export
 * @return {animatejs.Animation}
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

