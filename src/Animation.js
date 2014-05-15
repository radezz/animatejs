goog.provide('animatejs.Animation');

goog.require('animatejs.KeyFrame');
goog.require('animatejs.util');
goog.require('animatejs.util.LinkedList');
goog.require('goog.object');



/**
 * Animation
 * @constructor
 * @extends {animatejs.util.LinkedList}
 * @param {Object} properties
 * @param {Object=} opt_options
 * @export
 */
animatejs.Animation = function(properties, opt_options) {
  'use strict';
  var options = opt_options || {};

  if (!goog.isObject(properties)) {
    throw new TypeError();
  }

  //init linked list
  animatejs.Animation.superClass_.constructor.call(this);

  //set a start frame as first list element (tail)
  this.link(new animatejs.KeyFrame(0, properties));

  /**
   * @type {boolean}
   * @private
   */
  this.loop_ = false;

};
goog.inherits(animatejs.Animation, animatejs.util.LinkedList);


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
 * @protected
 */
animatejs.Animation.prototype.link = function(keyFrame) {
  'use strict';
  animatejs.Animation.superClass_.link.call(this, keyFrame);
  //FIXME all forward needs to be changed
  goog.object.extend(keyFrame.data, keyFrame['prev'].data, keyFrame.data);
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

  if (keyFrame['at'] > head['at']) {
    this.link(keyFrame);
  } else {
    //find proper place for key frame
    frame = this.getTail();
    while (frame) {
      if (frame['at'] === keyFrame['at']) {
        //replace frame with new one
        this.link(keyFrame, frame);
        this.unlink(frame);
        break;
      } else if (keyFrame['at'] < frame['at']) {
        this.link(keyFrame, frame);
        break;
      }
      frame = frame['next'];
    }
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


