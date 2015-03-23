goog.provide('animatejs.dom');
/**
 * Helper method for manipulating dom objects
 */


/**
 * @type {string}
 */
animatejs.dom.DOM_CSS_PREFIX = (function() {
  'use strict';
  var prefix,
      docStyle = window.getComputedStyle(document.documentElement, ''),
      prefixFix = {
        'moz': 'Moz',
        'webkit': 'Webkit'
      };
  prefix = (Array.prototype.slice.call(docStyle).join('').match(/-(moz|webkit|ms)-/) || (
      docStyle['OLink'] === '' && ['', 'O']))[1] || '';
  return prefixFix[prefix] || prefix;
}());


/**
 * Function returns prefixed property
 * @param {string} styleProperty
 * @return {string}
 */
animatejs.dom.cssPrefixedProperty = function(styleProperty) {
  'use strict';
  return !animatejs.dom.DOM_CSS_PREFIX ? styleProperty : animatejs.dom.DOM_CSS_PREFIX +
      styleProperty[0].toUpperCase() + styleProperty.substr(1);
};


/**
 * @enum {string}
 */
animatejs.dom.CSS = {
  TRANSFORM: 'transform',
  TRANSFORM_ORIGIN: 'transformOrigin'
};


/**
 * Prefixed
 * @type {Object}
 */
animatejs.dom.CSS_PREFIXED = (function() {
  'use strict';
  var key,
      prefixed = {};
  for (key in animatejs.dom.CSS) {
    prefixed[key] = animatejs.dom.cssPrefixedProperty(animatejs.dom.CSS[key]);
  }
  return prefixed;
}());





