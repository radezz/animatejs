goog.provide('animatejs.ease');


/**
 * Linear ease
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.LINEAR = function(p) {
  'use strict';
  return p;
};


/**
 * Ease in quadratic
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.EASE_IN_QUAD = function(p) {
  'use strict';
  return p * p;
};


/**
 * Ease in quadratic
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.EASE_OUT_QUAD = function(p) {
  'use strict';
  return -p * (p - 2);
};


/**
 * Ease in out quintic
 * @param {number} p
 * @return {number}
 * @export
 */
animatejs.ease.EASE_IN_OUT_QUINT = function(p) {
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
animatejs.ease.EASE_OUT_CIRC = function(p) {
  'use strict';
  return Math.sqrt(2 * p - p * p);
};


