goog.provide('animatejs.util.LinkedList');

goog.require('goog.Disposable');



/**
 * Linked list
 * @constructor
 * @extends {goog.Disposable}
 */
animatejs.util.LinkedList = function() {
  'use strict';
  animatejs.util.LinkedList.superClass_.constructor.call(this);

  /**
   * @type {animatejs.util.LinkedListElement}
   * @private
   */
  this.head_ = null;

  /**
   * @type {animatejs.util.LinkedListElement}
   * @private
   */
  this.tail_ = null;

  /**
   * @type {number}
   * @private
   */
  this.length_ = 0;
};
goog.inherits(animatejs.util.LinkedList, goog.Disposable);


/**
 * Function return length of the linked list
 * @return {number}
 * @protected
 */
animatejs.util.LinkedList.prototype.getLength = function() {
  'use strict';
  return this.length_;
};


/**
 * Function return the head of the list
 * @return {animatejs.util.LinkedListElement}
 * @protected
 */
animatejs.util.LinkedList.prototype.getHead = function() {
  'use strict';
  return this.head_;
};


/**
 * Function return the tail of the list
 * @return {animatejs.util.LinkedListElement}
 * @protected
 */
animatejs.util.LinkedList.prototype.getTail = function() {
  'use strict';
  return this.tail_;
};


/**
 * Function adds element to linked list
 * @param {animatejs.util.LinkedListElement} element
 * @param {animatejs.util.LinkedListElement=} opt_before
 * @protected
 */
animatejs.util.LinkedList.prototype.addElement = function(element, opt_before) {
  'use strict';
  var ownerList = element.getOwnerList();
  if (ownerList) {
    ownerList.unlink(element);
  }

  if (opt_before) {
    element['prev'] = opt_before['prev'];
    element['next'] = opt_before;
    opt_before['prev'] = element;
  } else {
    element['prev'] = this.head_;
    this.head_ = element;
  }

  if (!element['prev']) {
    this.tail_ = element;
  }

  element.setOwnerList(this);
  this.length_++;
};


/**
 * Function removes element from the list
 * @param {animatejs.util.LinkedListElement} element
 * @protected
 */
animatejs.util.LinkedList.prototype.unlink = function(element) {
  'use strict';

  var ownerList = element.getOwnerList();
  if (ownerList !== this) {
    ownerList.unlink(element);
    return;
  }

  if (element['prev'] && element['next']) {
    element['prev']['next'] = element['next'];
    element['next']['prev'] = element['prev'];
  } else if (element['prev']) {
    element['prev']['next'] = null;
    this.head_ = element['prev'];
  } else if (element['next']) {
    element['next']['prev'] = null;
    this.tail_ = element['next'];
  } else {
    this.head_ = null;
    this.tail_ = null;
  }

  element.setOwnerList(null);
  this.length_--;
};


/**
 * Function is called on object destruction. Unlinks all element
 * @protected
 */
animatejs.util.LinkedList.prototype.disposeInternal = function() {
  'use strict';
  var element = this.head_;
  while (element) {
    this.unlink(element);
    element = this.head_;
  }
};


