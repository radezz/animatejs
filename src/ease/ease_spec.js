goog.require('animatejs.ease');


/**
 * TODO: figure out how to test this correctly
 */
describe('animatejs.ease', function() {
  'use strict';
  describe('linear', function() {
    it('returns same a number', function() {
      expect(animatejs.ease.linear(0)).toBe(0);
      expect(animatejs.ease.linear(1)).toBe(1);
    });
  });

  describe('easeinquad', function() {
    it('returns modified number', function() {
      expect(animatejs.ease.easeinquad(0)).toBe(0);
      expect(animatejs.ease.easeinquad(1)).toBe(1);
    });
  });

  describe('easeoutquad', function() {
    it('returns modified number', function() {
      expect(animatejs.ease.easeoutquad(0)).toBe(0);
      expect(animatejs.ease.easeoutquad(1)).toBe(1);
    });
  });

  describe('easeinoutquint', function() {
    it('returns modified number', function() {
      expect(animatejs.ease.easeinoutquint(0)).toBe(0);
      expect(animatejs.ease.easeinoutquint(1)).toBe(1);
    });
  });

  describe('easeoutcirc', function() {
    it('returns modified number', function() {
      expect(animatejs.ease.easeoutcirc(0)).toBe(0);
      expect(animatejs.ease.easeoutcirc(1)).toBe(1);
    });
  });
});



