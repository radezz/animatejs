goog.require('animatejs.Animation');
goog.require('animatejs.KeyFrameList');


describe('animatejs.Animation', function() {
  'use strict';

  var animation;

  beforeEach(function() {
    animation = new animatejs.Animation({
      'prop': 0
    });
  });


  describe('constructor', function() {
    it('initialized aniamtion object', function() {
      var props = {
        'prop': 1
      },
          anim = new animatejs.Animation(props);

      expect(anim).toBeDefined();
      expect(anim.properties).toBe(props);
      expect(anim.keyFrames instanceof animatejs.KeyFrameList).toBe(true);
    });
  });

  describe('keyFrame', function() {
    it('adds new key frame to the animation', function() {
      animation.keyFrame(10, {
        'prop': 10
      }, animatejs.ease.EASEINQUAD);
      var keyFrame = animation.keyFrames.getArray()[1];
      expect(keyFrame instanceof animatejs.KeyFrame).toBe(true);
      expect(keyFrame.at).toBe(10);
      expect(keyFrame.ease).toBe(animatejs.ease.EASEINQUAD);
    });
  });

});

