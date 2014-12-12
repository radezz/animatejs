goog.provide('animatejs.ease');

goog.require('goog.math.Bezier');


/**
 * Linear ease
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.linear = function(p) {
  'use strict';
  return p;
};


/**
 * Ease in quadratic
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.easeinquad = function(p) {
  'use strict';
  return p * p;
};


/**
 * Ease in quadratic
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.easeoutquad = function(p) {
  'use strict';
  return -p * (p - 2);
};


/**
 * Ease in out quintic
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.easeinoutquint = function(p) {
  'use strict';
  p = 2 * p;
  if (p < 1) {
    return p * p * p * p * p / 2;
  }
  p -= 2;
  return p * p * p * p * p / 2 + 1;
};


/**
 * Ease out circ
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.easeoutcirc = function(p) {
  'use strict';
  return Math.sqrt(2 * p - p * p);
};


/**
 * Creates cubic bezier ease function
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 *
 * @export
 * @return {Function}
 */
animatejs.ease.createBezier = function(x1, y1, x2, y2) {
  'use strict';
  if (!goog.isNumber(x1) ||
      !goog.isNumber(y1) ||
      !goog.isNumber(x2) ||
      !goog.isNumber(y2)) {
    throw new TypeError('all coords must be numbers');
  }

  x1 = (x1 < 0) ? 0 : (x1 > 1) ? 1 : x1;
  x2 = (x2 < 0) ? 0 : (x2 > 1) ? 1 : x2;

  var bezier = new goog.math.Bezier(0, 0, x1, y1, x2, y2, 1, 1);
  return function(p) {
    return bezier.solveYValueFromXValue(p);
  };
};

