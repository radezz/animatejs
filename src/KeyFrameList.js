goog.provide('animatejs.KeyFrameList');

goog.require('animatejs.KeyFrame');
goog.require('animatejs.util');
goog.require('animatejs.util.LinkedList');



/**
 * KeyFrame List represents a linked list of key frames. It validates
 * insertions and removal of keyframes. It organises key frames
 * in the ascending order using 'at' property of the keyframes, and
 * preserves keyframes attribute integrity, which means every key
 * frame added needs to have same amount and same properties as
 * initial properties.
 *
 * @constructor
 * @extends {animatejs.util.LinkedList}
 * @param {Object} properties properties definition end initial values
 * @export
 */
animatejs.KeyFrameList = function(properties) {
  'use strict';

  if (!goog.isObject(properties)) {
    throw new TypeError();
  }

  //init linked list
  animatejs.KeyFrameList.superClass_.constructor.call(this);

  /**
  * List of initial properties used to check against
  * when inserting new key frames
  * @type {Array.<string>}
  */
  this['frameProperties'] = [];

  //set list of properties
  this.initFrameProperties_(properties);

  //set a start frame as first list element (tail)
  this.link(new animatejs.KeyFrame(0, properties));

};
goog.inherits(animatejs.KeyFrameList, animatejs.util.LinkedList);


/**
 * Function sets list of animation properties
 * @param {Object} properties
 * @private
 */
animatejs.KeyFrameList.prototype.initFrameProperties_ = function(properties) {
  'use strict';
  var key;
  for (key in properties) {
    if (properties.hasOwnProperty(key)) {
      this['frameProperties'].push(key);
    }
  }
};


/**
 * Function links new keyFrame with the list. It extends previous key frame
 * properties with new keyframe properties
 * @param {animatejs.KeyFrame} keyFrame
 * @param {animatejs.KeyFrame=} opt_before
 * @protected
 */
animatejs.KeyFrameList.prototype.link = function(keyFrame, opt_before) {
  'use strict';
  var i = this['frameProperties'].length;
  if (this.getTail()) {
    /*
     * Validate keyFrame properties. Properties in key frames
     * must be same
     */
    while (i--) {
      if (!keyFrame['data'].hasOwnProperty(this['frameProperties'][i])) {
        throw new Error();
      }
    }
  }
  animatejs.KeyFrameList.superClass_.link.call(this, keyFrame, opt_before);
};


/**
 * Function adds key frame to the animation
 * @param {animatejs.KeyFrame} keyFrame
 * @return {animatejs.KeyFrameList}
 * @export
 */
animatejs.KeyFrameList.prototype.add = function(keyFrame) {
  'use strict';
  var frame;

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
 * Alias for linked list unlink
 * @export
 */
animatejs.KeyFrameList.prototype.remove = animatejs.KeyFrameList.prototype.unlink;


/**
 * Disposes the object
 * @protected
 */
animatejs.KeyFrameList.prototype.disposeInternal = function() {
  'use strict';
  this['frameProperties'] = null;
  animatejs.KeyFrameList.superClass_.disposeInternal.call(this);
};





