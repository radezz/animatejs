goog.provide('animatejs.util.LinkedListElement');



/**
 * LinkedListElement
 * @constructor
 * @param {*} data
 */
animatejs.util.LinkedListElement = function(data) {
  'use strict';

  /**
   * @type {*}
   */
  this['data'] = data;

  /**
   * @type {aniamtejs.util.LinkedListElement}
   */
  this['next'] = null;

  /**
   * @type {animatejs.util.LinkedListElement}
   */
  this['prev'] = null;


};



