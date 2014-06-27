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

  afterEach(function() {
    animation.destroy();
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

  describe('play', function() {
    var originalTimeout;

    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('throw exception if there is only starting key frame', function() {
      expect(function() {
        animation.play();
      }).toThrow();
    });

    it('starts and runs animation', function(done) {
      var startSpy = jasmine.createSpy('startSpy'),
          frameSpy = jasmine.createSpy('framListener'),
          endSpy = jasmine.createSpy('endListener');

      animation.keyFrame(100, {
        'prop': 10
      });

      animation.on('start', startSpy);
      animation.on('frame', frameSpy);
      animation.on('finish', endSpy);
      animation.play();

      setTimeout(function() {
        expect(startSpy).toHaveBeenCalled();
        expect(startSpy.calls.count()).toBe(1);
        expect(frameSpy).toHaveBeenCalled();
        expect(frameSpy.calls.count()).toBeGreaterThan(1);
        expect(endSpy).toHaveBeenCalled();
        expect(endSpy.calls.count()).toBe(1);
        done();
      }, 150);

    });
  });

  describe('pause', function() {
    var originalTimeout;

    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('pauses animation', function(done) {
      var atTime,
          frameSpy = jasmine.createSpy('framListener');

      animation.keyFrame(500, {
        'prop': 10
      });

      animation.play();
      setTimeout(function() {
        atTime = animation.getAtTime();
        animation.pause();
        animation.on('frame', frameSpy);

        setTimeout(function() {
          expect(frameSpy).not.toHaveBeenCalled();
          animation.play();
          setTimeout(function() {
            expect(animation.getAtTime()).toBeGreaterThan(atTime);
            expect(frameSpy).toHaveBeenCalled();
            done();
          }, 80);

        }, 80);

      }, 50);

    });
  });

  describe('loop', function() {
    it('it should turn on animation looping', function(done) {
      animation.keyFrame(20, {
        'prop': 10
      }).loop().play();

      setTimeout(function() {
        expect(animation.isRunning()).toBe(true);
        done();
      }, 50);

    });
  });

  describe('set', function() {
    it('sets animation to provided time', function() {
      animation.keyFrame(5, {
        'prop': 10
      });

      animation.set(2);
      expect(animation.properties.prop).toBe(4);
    });

    it('sets animation time to last key frame if excedded the range', function() {
      animation.keyFrame(5, {
        'prop': 10
      });
      animation.set(10);
      expect(animation.getAtTime()).toBe(5);
    });
  });

  describe('isRunning', function() {
    it('returns true if animation is running flase otherwise', function() {
      animation.keyFrame(1000, {
        'prop': 10
      });

      animation.play();
      expect(animation.isRunning()).toBe(true);
      animation.stop();
      expect(animation.isRunning()).toBe(false);
    });
  });

  describe('onFrame', function() {

    it('passes frame timestamp into the animation', function() {
      animation.keyFrame(10, {
        'prop': 10
      });
      animation.play();
      animation.onFrame(animatejs.util.now() + 5);
      expect(animation.properties.prop).toBe(5);
    });
  });

  describe('getAtTime', function() {
    it('returns time which animation is currently at', function() {
      animation.keyFrame(10, {
        'prop': 10
      });
      animation.play();
      animation.onFrame(animatejs.util.now() + 5);
      expect(animation.getAtTime()).toBe(5);
    });
  });

  describe('destroy', function() {
    it('stops animation and destroys references', function() {
      spyOn(animation.keyFrames, 'destroy').and.callThrough();
      animation.keyFrame(10, {
        'prop': 10
      });
      animation.play();
      animation.destroy();
      expect(animation.isRunning()).toBe(false);
      expect(animation.keyFrames.destroy).toHaveBeenCalled();
    });
  });

});

