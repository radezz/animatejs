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

  if (!goog.isObject) {
    throw new TypeError();
  }

  if (opt_ease && !goog.isFunction(opt_ease)) {
    throw new TypeError();
  }

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


