goog.provide('animatejs.KeyFrame');

goog.require('animatejs.ease');
goog.require('animatejs.util.LinkedListElement');



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
    throw new TypeError();
  } else if (at < 0) {
    throw new Error();
  }

  if (opt_ease && !goog.isFunction(opt_ease)) {
    throw new TypeError();
  }

  animatejs.KeyFrame.validateProperties(properties);

  animatejs.KeyFrame.superClass_.constructor.call(this, properties);

  /**
   * @type {function(number):number}
   */
  this['ease'] = opt_ease;

  /**
   * @type {number}
   */
  this['at'] = at;
};
goog.inherits(animatejs.KeyFrame, animatejs.util.LinkedListElement);


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
    throw new TypeError();
  }

  for (key in properties) {
    if (properties.hasOwnProperty(key) && !goog.isNumber(properties[key])) {
      throw new TypeError();
    }
    hasProperties = true;
  }

  if (!hasProperties) {
    throw new Error();
  }
};



