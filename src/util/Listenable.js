goog.provide('animatejs.util.Listenable');

goog.require('animatejs.util.error');
goog.require('goog.Disposable');



/**
 * Listenable is a simple message listener and dispatcher. (Internal only)
 * @constructor
 * @extends {goog.Disposable}
 * @export
 * @access private
 */
animatejs.util.Listenable = function() {
  'use strict';

  animatejs.util.Listenable.superClass_.constructor.call(this);

  /**
   * @type {Object}
   * @private
   */
  this.registry_ = {};
};
goog.inherits(animatejs.util.Listenable, goog.Disposable);


/**
 * Function validates on, off, once arguments
 * @param {string} message
 * @param {Function} listener
 * @private
 */
animatejs.util.Listenable.prototype.validateListenerArgs_ = function(message, listener) {
  'use strict';
  if (!goog.isString(message)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(1, animatejs.util.error.type.STRING));
  }
  if (!goog.isFunction(listener)) {
    throw new TypeError(animatejs.util.error.typeErrorMsg(2, animatejs.util.error.type.FUNCTION));
  }
};


/**
 * Function registers message listener
 * @param {string} message
 * @param {Function} listener
 * @return {animatejs.util.Listenable}
 * @export
 */
animatejs.util.Listenable.prototype.on = function(message, listener) {
  'use strict';

  this.validateListenerArgs_(message, listener);

  if (!this.registry_[message]) {
    this.registry_[message] = [];
  }

  this.registry_[message].push(listener);
  return this;
};


/**
 * Function unregisters message listener
 * @param {string} message
 * @param {Function} listener
 * @return {animatejs.util.Listenable}
 * @export
 */
animatejs.util.Listenable.prototype.off = function(message, listener) {
  'use strict';
  var msgReg,
      i;
  this.validateListenerArgs_(message, listener);
  msgReg = this.registry_[message];
  if (msgReg) {
    i = msgReg.length;
    while (i--) {
      if (msgReg[i] === listener) {
        msgReg.splice(i, 1);
      }
    }
  }
  return this;
};


/**
 * Function registers listener which is removed after being
 * triggered
 * @param {string} message
 * @param {Function} listener
 * @return {Function} onceListener
 * @export
 */
animatejs.util.Listenable.prototype.once = function(message, listener) {
  'use strict';
  var that = this;
  this.validateListenerArgs_(message, listener);
  function onceListener(messageObj) {
    listener(messageObj);
    that.off(message, onceListener);
  }
  this.on(message, onceListener);
  return onceListener;
};


/**
 * Function unregisters listeners for chosen message
 * @param {string} message
 * @export
 */
animatejs.util.Listenable.prototype.cancel = function(message) {
  'use strict';
  if (this.registry_[message]) {
    delete this.registry_[message];
  }
};


/**
 * Function sends message to all listeners
 * @param {string} message
 * @param {...Object} var_args
 * @export
 */
animatejs.util.Listenable.prototype.dispatch = function(message, var_args) { // jshint ignore:line
  'use strict';
  var args = Array.prototype.slice.call(arguments, 1),
      msgReg = this.registry_[message],
      i,
      l;
  if (msgReg && msgReg.length) {
    for (i = 0, l = msgReg.length; i < l; i++) {
      msgReg[i].apply(goog.global, args);
    }
  }
};


/**
 * @protected
 * @access private
 */
animatejs.util.Listenable.prototype.disposeInternal = function() {
  'use strict';
  this.registry_ = null;
  animatejs.util.Listenable.superClass_.disposeInternal.call(this);
};

