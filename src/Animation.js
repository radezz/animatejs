goog.provide('animatejs.Animation');

goog.require('animatejs.util.LinkedList');



/**
 * Animation
 * @constructor
 * @extends {animatejs.util.LinkedList}
 * @export
 */
animatejs.Animation = function() {
  'use strict';
  animatejs.Animation.superClass_.constructor.call(this);

};
goog.inherits(animatejs.Animation, animatejs.util.LinkedList);

