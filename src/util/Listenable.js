goog.provide('animatejs.util.Listenable');

goog.require('goog.Disposable');



/**
 * Listenable is a simple message listener and dispatcher
 * @constructor
 * @extends {goog.Disposable}
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
 * @param {string} errMessage
 * @private
 */
animatejs.util.Listenable.prototype.validateListenerArgs_ = function(message, listener, errMessage) {
  'use strict';
  if (!goog.isString(message)) {
    throw new TypeError(errMessage);
  }
  if (!goog.isFunction(listener)) {
    throw new TypeError(errMessage);
  }
};


/**
 * Function registers message listener
 * @param {string} message
 * @param {Function} listener
 */
animatejs.util.Listenable.prototype.on = function(message, listener) {
  'use strict';

  this.validateListenerArgs_(message, listener, '');

  if (!this.registry_[message]) {
    this.registry_[message] = [];
  }

  this.registry_[message].push(listener);
};


/**
 * Function unregisters message listener
 * @param {string} message
 * @param {Function} listener
 * @return {animatejs.util.Listenable}
 */
animatejs.util.Listenable.prototype.off = function(message, listener) {
  'use strict';
  var msgReg,
      i;
  this.validateListenerArgs_(message, listener, '');
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
 */
animatejs.util.Listenable.prototype.once = function(message, listener) {
  'use strict';
  var that = this;
  this.validateListenerArgs_(message, listener, '');
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
 * @param {Object=} opt_messageObj
 */
animatejs.util.Listenable.prototype.dispatch = function(message, opt_messageObj) {
  'use strict';
  var msgReg = this.registry_[message],
      i,
      l;
  if (msgReg) {
    for (i = 0, l = msgReg.length; i < l; i++) {
      msgReg[i](opt_messageObj);
    }
  }
};


/**
 * @protected
 */
animatejs.util.Listenable.prototype.disposeInternal = function() {
  'use strict';
  this.registry_ = null;
  animatejs.util.Listenable.superClass_.disposeInternal.call(this);
};

