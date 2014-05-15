goog.provide('animatejs.util');


/**
 * Helper for checking instanceof
 * @param {*} obj
 * @param {Function} ofType
 * @return {boolean}
 */
animatejs.util.instanceOf = function(obj, ofType) {
  'use strict';
  return obj instanceof ofType;
};


