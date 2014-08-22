goog.require('animatejs.Frame');

describe('animatejs.Frame', function() {
  'use strict';
  describe('constructor', function() {
    it('creates frame object', function() {
      var props = {},
          kfr = {},
          kfr2 = {},
          changed = [];

      var fr = new animatejs.Frame(10, props, changed, kfr, kfr2);
      expect(fr.at).toBe(10);
      expect(fr.properties).toBe(props);
      expect(fr.changedProperties).toBe(changed);
      expect(kfr).toBe(kfr);
      expect(kfr2).toBe(kfr2);
    });
  });
});
