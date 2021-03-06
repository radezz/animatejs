goog.provide('animatejs.util.LinkedList');

goog.require('animatejs.util');
goog.require('animatejs.util.LinkedListElement');
goog.require('animatejs.util.Listenable');
goog.require('animatejs.util.error');



/**
 * Linked list. (Internal only)
 * @constructor
 * @extends {animatejs.util.Listenable}
 * @export
 * @access private
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
goog.inherits(animatejs.util.LinkedList, animatejs.util.Listenable);


/**
 * Function return length of the linked list
 * @return {number}
 * @protected
 * @access private
 */
animatejs.util.LinkedList.prototype.getLength = function() {
  'use strict';
  return this.length_;
};


/**
 * Function return the head of the list
 * @return {animatejs.util.LinkedListElement}
 * @protected
 * @access private
 */
animatejs.util.LinkedList.prototype.getHead = function() {
  'use strict';
  return this.head_;
};


/**
 * Function return the tail of the list
 * @return {animatejs.util.LinkedListElement}
 * @protected
 * @access private
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
 * @access private
 */
animatejs.util.LinkedList.prototype.link = function(element, opt_before) {
  'use strict';
  var lle = 'LinkedListElement';

  if (!animatejs.util.instanceOf(element, animatejs.util.LinkedListElement)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(2, lle));
  }

  if (opt_before &&
      !animatejs.util.instanceOf(opt_before, animatejs.util.LinkedListElement)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(2, lle));
  }

  var ownerList = element.getOwnerList();
  if (ownerList) {
    ownerList.unlink(element);
  }

  if (opt_before && this.hasElement(opt_before)) {
    element['prev'] = opt_before['prev'];
    if (element['prev']) {
      element['prev']['next'] = element;
    }
    element['next'] = opt_before;
    opt_before['prev'] = element;
  } else {
    element['prev'] = this.head_;
    if (this.head_) {
      this.head_['next'] = element;
    }
    this.head_ = element;
  }

  if (!element['prev']) {
    this.tail_ = element;
  }

  element.setOwnerList(this);
  this.length_++;
  this.dispatch('add', element);
};


/**
 * Function removes element from the list
 * @param {animatejs.util.LinkedListElement} element
 * @access private
 */
animatejs.util.LinkedList.prototype.unlink = function(element) {
  'use strict';

  if (!animatejs.util.instanceOf(element, animatejs.util.LinkedListElement)) {
    throw new TypeError();
  }

  var ownerList = element.getOwnerList();
  if (ownerList !== this) {
    //unlink from the owning list
    ownerList.unlink(element);
    return;
  }

  if (element['prev'] && element['next']) {
    //element from the middle of the list
    element['prev']['next'] = element['next'];
    element['next']['prev'] = element['prev'];
  } else if (element['prev']) {
    //head element prev only
    element['prev']['next'] = null;
    this.head_ = element['prev'];
  } else if (element['next']) {
    //tail element next only
    element['next']['prev'] = null;
    this.tail_ = element['next'];
  } else {
    //no next prev the only element on the list
    this.head_ = null;
    this.tail_ = null;
  }

  element['next'] = null;
  element['prev'] = null;
  element.setOwnerList(null);
  this.length_--;
  this.dispatch('remove', element);
};


/**
 * Function checks if element is on the list
 * @param {animatejs.util.LinkedListElement} element
 * @return {boolean}
 * @protected
 * @access private
 */
animatejs.util.LinkedList.prototype.hasElement = function(element) {
  'use strict';
  if (!animatejs.util.instanceOf(element, animatejs.util.LinkedListElement)) {
    throw new TypeError();
  }
  return element.getOwnerList() === this;
};


/**
 * Function is called on object destruction. Unlinks all elements
 * @protected
 * @access private
 */
animatejs.util.LinkedList.prototype.disposeInternal = function() {
  'use strict';
  var element = this.head_;
  while (element) {
    this.unlink(element);
    element = this.head_;
  }
  animatejs.util.LinkedList.superClass_.disposeInternal.call(this);
};


/**
 * Function returns key frames ordered as an array object
 * @return {Array.<animatejs.KeyFrame>}
 * @export
 */
animatejs.util.LinkedList.prototype.getArray = function() {
  'use strict';
  var element = this.getTail(),
      elements = [];
  while (element) {
    elements.push(element);
    element = element['next'];
  }
  return elements;
};



