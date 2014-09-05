/**
 * The root namespace
 * @namespace
 */
goog.provide('animatejs');


goog.require('animatejs.Scene');
goog.require('animatejs.dom.Transform');


/**
 * Function creates animation from JSON spec
 * @param {Object} animationSpec
 * @param {number=} opt_duration needs to be specified if the spec
 * used % values for key frames
 * @return {animatejs.Animation}
 * @export
 */
animatejs.create = function(animationSpec, opt_duration) {
  'use strict';
  var timeKeys = Object.keys(animationSpec),
      initialProperties,
      animation;

  animatejs.validateFrameTimes_(timeKeys, opt_duration);
  initialProperties = animatejs.getPropertySet_(animationSpec);
  animation = new animatejs.Animation(initialProperties);
  return animation;
};


/**
 * Function validates
 * @param {Array.<string>} timeKeys
 * @param {number} duration
 * @private
 */
animatejs.validateFrameTimes_ = function(timeKeys, duration) {
  'use strict';
  var i = timeKeys.length,
      parsed,
      hasStart,
      key;
  while (i--) {
    key = timeKeys[i];
    parsed = parseInt(key, 10);
    if (key.indexOf('%') !== -1 && typeof(duration) !== 'number') {
      throw new Error('duration needed when usng % values');
    }
    if (parsed === 0) {
      hasStart = true;
    }
  }
  if (!hasStart) {
    throw new Error('initial frame (at 0) required');
  }
};


/**
 * Function returns set of properties used in animation
 * @param {Object} animationSpec
 * @return {Object}
 * @private
 */
animatejs.getPropertySet_ = function(animationSpec) {
  'use strict';
  var timeKey,
      keyFrameSpec,
      propName,
      firstFrameProperties,
      properties = {};

  firstFrameProperties = animationSpec['0'] || animationSpec['0%'];
  for (timeKey in animationSpec) {
    if (animationSpec.hasOwnProperty(timeKey)) {
      keyFrameSpec = animationSpec[timeKey];
      for (propName in keyFrameSpec) {
        if (propName !== '_ease' && !properties[propName]) {
          properties[propName] = firstFrameProperties[propName] || 0;
        }
      }
    }
  }

  return properties;
};


/*
createAnimation({
  '0': {
    'prop1': 1,
    'prop2': 10
  },
  '10': {
    'prop1': 1,
    'prop2': 50,
    '_ease': linear
  },
  '100': {
    'prop1': 1,
    'prop2': 60,
    '_ease': linear
  }
}, 1000);


createAnimation([
  {
    at: '0%',
    properties: {
      'prop1: 1,
      'prop2': 2
    },
    ease: linear
  },
  {
    at: '0%',
    properties: {
      'prop1: 1,
      'prop2': 2
    },
    ease: linear
  }
], 1000)
*/




