goog.provide('animatejs.util.LinkedListElement');

goog.require('animatejs.util.Listenable');



/**
 * LinkedListElement
 * @constructor
 * @param {*=} opt_data
 * @extends {animatejs.util.Listenable}
 */
animatejs.util.LinkedListElement = function(opt_data) {
  'use strict';

  animatejs.util.LinkedListElement.superClass_.constructor.call(this);

  /**
   * @type {*}
   */
  this['data'] = opt_data || null;

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
goog.inherits(animatejs.util.LinkedListElement, animatejs.util.Listenable);


/**
 * Function sets owner list for current list element
 * @param {animatejs.util.LinkedList} linkedList
 */
animatejs.util.LinkedListElement.prototype.setOwnerList = function(linkedList) {
  'use strict';
  this.list_ = linkedList;
};


/**
 * Function gets owner list
 * @return {animatejs.util.LinkedList}
 */
animatejs.util.LinkedListElement.prototype.getOwnerList = function() {
  'use strict';
  return this.list_;
};

