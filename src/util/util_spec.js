goog.require('animatejs.util');


describe('animatejs.util', function() {
  'use strict';
  describe('instanceOf', function() {
    it('returns true if object is instance of another object false otherwise', function() {
      expect(animatejs.util.instanceOf([], Array)).toBe(true);
      expect(animatejs.util.instanceOf({}, Array)).toBe(false);
    });
  });

  describe('typeofObject', function() {
    it('returns true if object is typeof object false otherwise', function() {
      expect(animatejs.util.typeofObject([])).toBe(true);
      expect(animatejs.util.typeofObject(1)).toBe(false);
    });
  });

  describe('now', function() {
    it('returns current timestamp', function() {
      expect(animatejs.util.now()).toBe(Date.now());
    });
  });
});


