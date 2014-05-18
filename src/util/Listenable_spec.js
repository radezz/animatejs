goog.require('animatejs.util.Listenable');


describe('animatejs.util.Listenable', function() {
  'use strict';
  var listenable;

  beforeEach(function() {
    listenable = new animatejs.util.Listenable();
  });

  afterEach(function() {
    listenable.dispose();
  });

  describe('constructor', function() {
    it('creates Listenable instance', function() {
      var listenable;
      expect(function() {
        listenable = new animatejs.util.Listenable();
      }).not.toThrow();

      expect(listenable).toBeDefined();
    });
  });

  describe('on', function() {
    it('registeres listener to provided message', function() {
      var spy = jasmine.createSpy('message'),
          messageObj = {};
      listenable.on('messageName', spy);
      listenable.dispatch('messageName', messageObj);
      expect(spy).toHaveBeenCalledWith(messageObj);
    });
  });

  describe('once', function() {
    it('registeres a listener which is removed after first call', function() {
      var spy = jasmine.createSpy('message'),
          messageObj = {};

      listenable.once('messageName', spy);
      listenable.dispatch('messageName', messageObj);
      listenable.dispatch('messageName', messageObj);
      expect(spy.calls.count()).toBe(1);
    });
  });

  describe('off', function() {
    it('removes message listener', function() {
      var spy = jasmine.createSpy('message'),
          messageObj = {};
      listenable.on('messageName', spy);
      listenable.off('messageName', spy);
      listenable.dispatch('messageName', messageObj);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('cancel', function() {
    it('removes all message listeners of chosen type', function() {
      var spy = jasmine.createSpy('message'),
          spy2 = jasmine.createSpy('message');
      listenable.on('messageName', spy);
      listenable.on('messageName', spy2);
      listenable.cancel('messageName');
      listenable.dispatch('messageName');
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });

});


