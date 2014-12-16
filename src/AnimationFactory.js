goog.require('animatejs.Animation');
goog.provide('animatejs.AnimationFactory');


/**
 * Function creates animation from JSON spec
 * @param {Array.<Object>} keyFrameSpecs
 * @param {number=} opt_duration needs to be specified if the spec
 * used % values for key frames
 * @return {animatejs.Animation}
 * @export
 */
animatejs.Animation.create = function(keyFrameSpecs, opt_duration) {
  'use strict';
  var animation,
      keyFrameSpec,
      i,
      l;
  if (!goog.isArray(keyFrameSpecs)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.ARRAY));
  }

  validateFrameTimes_(keyFrameSpecs, opt_duration);
  fixPropertySet_(keyFrameSpecs);

  if (keyFrameSpecs.length <= 1) {
    throw new Error('at least 2 frames needs to be specified');
  }

  animation = new animatejs.Animation(keyFrameSpecs[0]['properties']);
  for (i = 0, l = keyFrameSpecs.length; i < l; i++) {
    keyFrameSpec = keyFrameSpecs[i];
    animation.keyFrame(keyFrameSpec['at'], keyFrameSpec['properties'], keyFrameSpec['ease']);
  }
  return animation;
};


/**
 * Function validates key frames times, and converts times passed with %
 * to integer time
 * @param {Array.<Object>} keyFrameSpecs
 * @param {number=} opt_duration
 * @private
 */
function validateFrameTimes_(keyFrameSpecs, opt_duration) {
  'use strict';
  var i = keyFrameSpecs.length,
      parsed,
      hasStart,
      atTime;
  while (i--) {
    atTime = keyFrameSpecs[i]['at'];
    parsed = parseInt(atTime, 10);
    if (goog.isString(atTime) && atTime.indexOf('%') !== -1) {
      if (!goog.isNumber(opt_duration)) {
        throw new Error('duration needed when using % values');
      }
      if (isNaN(parsed)) {
        throw new Error('invalid % value');
      }
      if (parsed > 100) {
        throw new Error('time cannot be greater than 100%');
      }
      //conver % to number
      keyFrameSpecs[i]['at'] = parsed * opt_duration / 100;
    }
    if (parsed === 0) {
      hasStart = true;
    }
  }
  if (!hasStart) {
    throw new Error('initial frame (at 0 or 0%) required');
  }

  keyFrameSpecs.sort(function(keyFrameA, keyFrameB) {
    return keyFrameA['at'] - keyFrameB['at'];
  });
}


/**
 * Function fixes missing properties, fills out missing
 * with closest known values
 * @param {Array.<Object>} keyFrameSpecs
 * @private
 */
function fixPropertySet_(keyFrameSpecs) {
  'use strict';
  var keyFrameSpec,
      updateFrameSpec,
      usedProperties = {},
      l = keyFrameSpecs.length,
      j,
      key,
      value,
      i;

  for (i = 0; i < l; i++) {
    keyFrameSpec = keyFrameSpecs[i];
    for (key in keyFrameSpecs['properties']) {
      value = keyFrameSpecs['properties'][key];
      if (!usedProperties[key]) {
        usedProperties[key] = true;
        //update previous frames with first known value
        j = i;
        while (j--) {
          updateFrameSpec = keyFrameSpecs[j];
          updateFrameSpec['properties'][key] = value;
        }
        //update next frames (fill last know values if not existing)
        for (j = i; j < l; j++) {
          updateFrameSpec = keyFrameSpecs[j];
          if (!updateFrameSpec['properties'][key]) {
            updateFrameSpec['properties'][key] = value;
          } else {
            value = updateFrameSpec['properties'][key];
          }
        }
      }
    }
  }
}


