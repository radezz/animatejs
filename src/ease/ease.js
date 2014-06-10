goog.provide('animatejs.ease');


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



