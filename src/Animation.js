goog.provide('animatejs.Animation');

goog.require('animatejs.KeyFrame');
goog.require('animatejs.util');
goog.require('animatejs.util.LinkedList');
goog.require('goog.object');



/**
 * Animation
 * @constructor
 * @extends {animatejs.util.LinkedList}
 * @param {Object} properties properties definition end initial values
 * @param {Object=} opt_options
 * @export
 */
animatejs.Animation = function(properties, opt_options) {
  'use strict';
  var options = opt_options || {},
      key;

  if (!goog.isObject(properties)) {
    throw new TypeError();
  }

  //init linked list
  animatejs.Animation.superClass_.constructor.call(this);

  /**
   * @type {Array.<string>}
   * @private
   */
  this.animationProperties_ = [];

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

  //set list of properties
  this.initProperties_(properties);

  //set a start frame as first list element (tail)
  this.link(new animatejs.KeyFrame(0, properties));

};
goog.inherits(animatejs.Animation, animatejs.util.LinkedList);


/**
 * Function sets list of animation properties
 * @param {Object} properties
 * @private
 */
animatejs.Animation.prototype.initProperties_ = function(properties) {
  'use strict';
  var key;
  for (key in properties) {
    if (properties.hasOwnProperty(key)) {
      this.animationProperties_.push(key);
    }
  }
};


/**
 * Function creates and adds key frame to the animation
 * @param {number} at
 * @param {Object} properties
 * @param {function(number):number=} opt_ease
 * @return {animatejs.Animation}
 * @export
 */
animatejs.Animation.prototype.keyFrame = function(at, properties, opt_ease) {
  'use strict';
  var keyFrame = new animatejs.KeyFrame(at, properties, opt_ease);
  return this.addKeyFrame(keyFrame);
};


/**
 * Function links new keyFrame with the list. It extends previous key frame
 * properties with new keyframe properties
 * @param {animatejs.KeyFrame} keyFrame
 * @param {animatejs.KeyFrame=} opt_before
 * @protected
 */
animatejs.Animation.prototype.link = function(keyFrame, opt_before) {
  'use strict';
  var i = this.animationProperties_.length;
  if (this.getTail()) {
    /*
     * Validate keyFrame properties. Properties in key frames
     * must be
     */
    while (i--) {
      if (!keyFrame['data'].hasOwnProperty(this.animationProperties_[i])) {
        throw new Error();
      }
    }
  }
  animatejs.Animation.superClass_.link.call(this, keyFrame, opt_before);
};


/**
 * Function adds key frame to the animation
 * @param {animatejs.KeyFrame} keyFrame
 * @return {animatejs.Animation}
 * @export
 */
animatejs.Animation.prototype.addKeyFrame = function(keyFrame) {
  'use strict';
  var head = this.getHead(),
      frame;

  //find proper place for key frame
  frame = this.getHead();
  while (frame) {
    if (frame['at'] === keyFrame['at']) {
      //replace frame with new one
      this.link(keyFrame, frame);
      this.unlink(frame);
      break;
    } else if (keyFrame['at'] > frame['at']) {
      this.link(keyFrame, frame['next']);
      break;
    }
    frame = frame['prev'];
  }


  return this;
};


/**
 * Function returns key frames ordered as an array object
 * @return {Array.<animatejs.KeyFrame>}
 */
animatejs.Animation.prototype.getKeyFrames = function() {
  'use strict';
  var frame = this.getTail(),
      frames = [];
  while (frame) {
    frames.push(frame);
    frame = frame['next'];
  }
  return frames;
};


/**
 * Disposes the object
 * @protected
 */
animatejs.Animation.prototype.disposeInternal = function() {
  'use strict';
  this.animationProperties_ = null;
  animatejs.Animation.superClass_.disposeInternal.call(this);
};


