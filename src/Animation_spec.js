goog.require('animatejs.Animation');


describe('animatejs.Animation', function() {
  'use strict';

  describe('constructor', function() {
    it('initialized aniamtion object', function() {
      var props = {
        'prop': 1
      },
          anim = new animatejs.Animation(props);

      expect(anim).toBeDefined();
      expect(anim.properties).toBe(props);
    });
  });

});

