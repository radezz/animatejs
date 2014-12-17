goog.provide('animatejs.util.LinkedListElement');

goog.require('animatejs.util.Listenable');



/**
 * LinkedListElement (Internal only)
 * @constructor
 * @param {*=} opt_data
 * @access private
 */
animatejs.util.LinkedListElement = function(opt_data) {
  'use strict';

  /**
   * @name animatejs.util.LinkedListElement#data
   * @type {*}
   */
  this['data'] = opt_data || null;

  /**
   * @name animatejs.util.LinkedListElement#next
   * @type {aniamtejs.util.LinkedListElement}
   */
  this['next'] = null;

  /**
   * @name animatejs.util.LinkedListElement#prev
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
 * @access private
 */
animatejs.util.LinkedListElement.prototype.setOwnerList = function(linkedList) {
  'use strict';
  this.list_ = linkedList;
};


/**
 * Function gets owner list
 * @return {animatejs.util.LinkedList}
 * @access private
 */
animatejs.util.LinkedListElement.prototype.getOwnerList = function() {
  'use strict';
  return this.list_;
};

