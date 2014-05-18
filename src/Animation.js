goog.provide('animatejs.Animation');

goog.require('animatejs.KeyFrameList');
goog.require('animatejs.util.Listenable');



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
  this['keyFrames'] = new animatejs.KeyFrameList(properties, options);

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
  this['keyFrames'].addKeyFrame(keyFrame);
  return this;
};


/**
 * @protected
 */
animatejs.Animation.prototype.disposeInternal = function() {
  'use strict';
  this['keyFrames'].dispose();
  animatejs.Animation.superClass_.disposeInternal.call(this);
};


