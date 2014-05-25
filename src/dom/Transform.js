goog.provide('animatejs.dom.Transform');

goog.require('animatejs.dom');
goog.require('goog.Disposable');



/**
 * Css transform helper
 * @constructor
 * @param {HTMLElement=} opt_el
 * @export
 * @extends {goog.Disposable};
 */
animatejs.dom.Transform = function(opt_el) {
  'use strict';
  this.element_ = opt_el;
  this.clear();
};
goog.inherits(animatejs.dom.Transform, goog.Disposable);


/**
 * Function clears the transformation
 * @return {animatejs.dom.Transform}
 * @export
 */
animatejs.dom.Transform.prototype.clear = function() {
  'use strict';

  /**
   * @type {Array.<number>}
   * @private
   */
  this.rotate_ = [0, 0, 0];

  /**
   * @type {Array.<number>}
   * @private
   */
  this.translate_ = [0, 0, 0];

  /**
   * @type {Array.<number>}
   * @private
   */
  this.scale_ = [0, 0, 0];
  return this;
};


/**
 * Function rotates over x axis
 * @param {number} angle
 * @return {animatejs.dom.Transform}
 * @export
 */
animatejs.dom.Transform.prototype.rotateX = function(angle) {
  'use strict';
  this.rotate_[0] += angle;
  return this;
};


/**
 * Function rotates over y axis
 * @param {number} angle
 * @return {animatejs.dom.Transform}
 * @export
 */
animatejs.dom.Transform.prototype.rotateY = function(angle) {
  'use strict';
  this.rotate_[1] += angle;
  return this;
};


/**
 * Function rotates over z axis
 * @param {number} angle
 * @return {animatejs.dom.Transform}
 * @export
 */
animatejs.dom.Transform.prototype.rotateZ = function(angle) {
  'use strict';
  this.rotate_[2] += angle;
  return this;
};


/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {animatejs.dom.Transform}
 * @export
 */
animatejs.dom.Transform.prototype.translate = function(x, y, z) {
  'use strict';
  this.translate_[0] += x;
  this.translate_[1] += y;
  this.translate_[2] += z;
  return this;
};


/**
 * Function scales
 * @param {number} x
 * @param {number=} opt_y
 * @param {number=} opt_z
 * @return {animatejs.dom.Transform}
 * @export
 */
animatejs.dom.Transform.prototype.scale = function(x, opt_y, opt_z) {
  'use strict';
  var y,
      z;
  if (!goog.isNumber(opt_y)) {
    y = x;
  }

  if (!goog.isNumber(opt_z)) {
    z = x;
  }
  this.scale_[0] += x;
  this.scale_[1] += y;
  this.scale_[2] += z;
  return this;
};


/**
 * Applies transformation to dom element
 * @export
 * @return {animatejs.dom.Transform}
 */
animatejs.dom.Transform.prototype.apply = function() {
  'use strict';
  var css = '';
  if (this.translate_[0] || this.translate_[1] || this.translate_[2]) {
    css += 'translate3d(' + this.translate_.join('px, ') + 'px)';
  }

  if (this.scale_[0] || this.scale_[1] || this.scale_[2]) {
    css += 'scale3d(' + this.scale_.join(',') + ')';
  }

  if (this.rotate_[0]) {
    css += 'rotateX(' + this.rotate_[0] + 'deg)';
  }

  if (this.rotate_[1]) {
    css += 'rotateY(' + this.rotate_[1] + 'deg)';
  }

  if (this.rotate_[2]) {
    css += 'rotateZ(' + this.rotate_[2] + 'deg)';
  }

  this.element_.style[animatejs.dom.CSS_PREFIXED.TRANSFORM] = css;
  return this;
};

