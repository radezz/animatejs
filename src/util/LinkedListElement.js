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

  /**
   * @type {animatejs.util.LinkedList}
   * @private
   */
  this.list_ = null;
};


/**
 * Function sets owner list for current list element
 * @param {animatejs.util.LinkedList} linkedList
 * @protected
 */
animatejs.util.LinkedListElement.prototype.setOwnerList = function(linkedList) {
  'use strict';
  this.list_ = linkedList;
};


/**
 * Function gets owner list
 * @return {animatejs.util.LinkedList}
 * @protected
 */
animatejs.util.LinkedListElement.prototype.getOwnerList = function() {
  'use strict';
  return this.list_;
};

