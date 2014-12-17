goog.provide('animatejs.KeyFrame');

goog.require('animatejs.ease');
goog.require('animatejs.util.LinkedListElement');
goog.require('animatejs.util.error');
goog.require('goog.object');



/**
 * KeyFrame
 * @constructor
 * @extends {animatejs.util.LinkedListElement}
 *
 * @param {number} at
 * @param {Object} properties
 * @param {function(number):number=} opt_ease
 */
animatejs.KeyFrame = function(at, properties, opt_ease) {
  'use strict';

  if (!goog.isNumber(at)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.NUMBER));
  } else if (at < 0) {
    throw new Error();
  }

  if (opt_ease && !goog.isFunction(opt_ease)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.FUNCTION));
  }

  animatejs.KeyFrame.validateProperties(properties);

  animatejs.KeyFrame.superClass_.constructor.call(this, properties);

  /**
   * @type {function(number):number}
   * @name animatejs.KeyFrame#ease
   */
  this['ease'] = opt_ease;

  /**
   * @type {number}
   * @name animatejs.KeyFrame#at
   */
  this['at'] = at;
};
goog.inherits(animatejs.KeyFrame, animatejs.util.LinkedListElement);


/**
 * Function creates a clone of a key frame. It preserves
 * property values
 * @export
 * @return {animatejs.KeyFrame}
 */
animatejs.KeyFrame.prototype.clone = function() {
  'use strict';
  return new animatejs.KeyFrame(this['at'], goog.object.clone(this['data']), this['ease']);
};


/**
 * Function validates propertis for key fram. All propertis
 * must be numeric.
 * @param {Object} properties
 * @export
 */
animatejs.KeyFrame.validateProperties = function(properties) {
  'use strict';
  var key,
      hasProperties = false;

  if (!animatejs.util.typeofObject(properties)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.OBJECT));
  }

  for (key in properties) {
    if (properties.hasOwnProperty(key) && !goog.isNumber(properties[key])) {
      throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.NUMBER));
    }
    hasProperties = true;
  }

  if (!hasProperties) {
    throw new Error();
  }
};



