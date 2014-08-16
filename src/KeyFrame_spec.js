goog.require('animatejs.KeyFrame');

describe('animatejs.KeyFrame', function() {
  'use strict';

  describe('constructor', function() {
    it('creates KeyFrame instance', function() {
      var kf = new animatejs.KeyFrame(1, {
        'prop': 1
      });
      expect(kf).toBeDefined();
      expect(kf.at).toBe(1);
      expect(kf.ease).not.toBeDefined();
    });

    it('throws exception if one of property is not numeric', function() {
      expect(function() {
        new animatejs.KeyFrame(1, { 'prop': 'string'});
      }).toThrow();
    });

    it('throws exception if "at" is not specified', function() {
      expect(function() {
        new animatejs.KeyFrame(null, { 'prop': 1 });
      }).toThrow();
    });

    it('throws exception if "at" is lower that 0', function() {
      expect(function() {
        new animatejs.KeyFrame(-10, { 'prop': 1 });
      }).toThrow();
    });

    it('throws exception if ease is specified but not a function', function() {
      expect(function() {
        new animatejs.KeyFrame(1, { 'prop': 1 }, {});
      }).toThrow();

      expect(function() {
        new animatejs.KeyFrame(1, { 'prop': 1 }, function() {});
      }).not.toThrow();

    });
  });

  describe('validateProperties', function() {
    it('throes exception if no properties specified', function() {
      expect(function() {
        new animatejs.KeyFrame(1, {});
      }).toThrow();
    });

    it('throws exception if properties param is not object', function() {
      expect(function() {
        new animatejs.KeyFrame(1, 1);
      }).toThrow();

      expect(function() {
        new animatejs.KeyFrame(1, '1');
      }).toThrow();

      expect(function() {
        new animatejs.KeyFrame(1, function() {});
      }).toThrow();
    });
  });
});

