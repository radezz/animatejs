goog.provide('animatejs.Frame');



/**
 * Frame defines a state of properties in time
 * @param {number} at defines the time value from the beginning of the animation
 * @param {Object} properties current properties values (key=value pairs)
 * @param {Array.<string>} changedProperties names of properties changed from last frame
 * @param {animatejs.KeyFrame} nextKeyFrame
 * @param {animatejs.KeyFrame} prevKeyFrame
 * @constructor
 * @export
 */
animatejs.Frame = function(at, properties, changedProperties, nextKeyFrame, prevKeyFrame) {
  'use strict';

  /**
   * Time of frame (from the beginning of the animation)
   * @type {number}
   */
  this['at'] = at;

  /**
   * Properties and their values at current time
   * @type {Object}
   */
  this['properties'] = properties;

  /**
   * List of property names which has changed comparing to last frame
   * @type {Array.<string>}
   */
  this['changedProperties'] = changedProperties;

  /**
   * Next key frame
   * @type {animatejs.KeyFrame}
   */
  this['nextKeyFrame'] = nextKeyFrame;

  /**
   * Previouse key frame
   * @type {animatejs.KeyFrame}
   */
  this['prevKeyFrame'] = prevKeyFrame;
};


