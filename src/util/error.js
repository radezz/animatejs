goog.provide('animatejs.util.error');


/**
 * Function returns formatted error message
 * @param {number} argNumber
 * @param {string} typeRequired
 * @return {string}
 */
animatejs.util.error.typeErrorMsg = function(argNumber, typeRequired) {
  'use strict';
  return 'argument ' + argNumber + ' needs to be ' + typeRequired;
};


/**
 * Enumeration for required types
 * @enum {string}
 */
animatejs.util.error.type = {
  NUMBER: 'a number',
  FUNCTION: 'a function',
  OBJECT: 'an object'
};


