goog.require('animatejs.Scene');

describe('aniamtejs.Scene', function() {
  'use strict';

  var origAnimation,
      animationMock,
      scene;

  beforeEach(function() {
    origAnimation = animatejs.Animation;

    animatejs.Animation = function() {};
    animatejs.Animation.prototype.setFrameRequester = function() {};
    animatejs.Animation.prototype.addOnDisposeCallback = function() {};
    animatejs.Animation.prototype.stop = function() {};
    animatejs.Animation.prototype.isRunning = function() {};
    animatejs.Animation.prototype.setParentScene = function() {};
    animatejs.Animation.prototype.getParentScene = function() {};

    animationMock = new animatejs.Animation();
    scene = new animatejs.Scene();
  });

  afterEach(function() {
    animatejs.Animation = origAnimation;
  });

  describe('constructor', function() {
    it('creates scene isntance', function() {
      expect(function() {
        new animatejs.Scene();
      }).not.toThrow();
    });
  });

  describe('add', function() {
    it('adds animation to scene', function() {
      scene.add(20, animationMock);
      expect(scene.getAnimationEntries().length).toBe(1);
    });

    it('sets frame requester to scene', function() {
      spyOn(animationMock, 'setFrameRequester');
      scene.add(20, animationMock);
      expect(animationMock.setFrameRequester).toHaveBeenCalledWith(scene);
    });

    it('throws exception if aniamtion is added for second time', function() {
      expect(function() {
        scene.add(20, animationMock);
        scene.add(30, animationMock);
      }).toThrow();
    });

    it('throws exceptions if first argument is not a number', function() {
      expect(function() {
        scene.add(animationMock);
      }).toThrow();
    });

    it('throws if second argument is not a animation', function() {
      expect(function() {
        scene.add(10, 10);
      }).toThrow();
    });

  });

  describe('remove', function() {
    var anim1,
        anim2;

    beforeEach(function() {
      anim1 = new animatejs.Animation();
      anim2 = new animatejs.Animation();
      scene.add(10, anim1);
      scene.add(20, anim2);
    });

    it('remove animation from the registry', function() {
      scene.remove(anim1);
      expect(scene.getAnimationEntries().length).toBe(1);
    });

    it('stops removed animation', function() {
      spyOn(anim1, 'isRunning').and.callFake(function() {
        return true;
      });
      spyOn(anim1, 'stop');
      scene.remove(anim1);
      expect(anim1.stop).toHaveBeenCalled();
    });

    it('assigns regular frame requester', function() {
      spyOn(anim1, 'setFrameRequester');
      scene.remove(anim1);
      expect(anim1.setFrameRequester).toHaveBeenCalledWith(animatejs.util);
    });
  });

  describe('has', function() {
    it('returns true if animation is already part of the scene', function() {
      var anim = new animatejs.Animation();
      scene.add(10, anim);
      expect(scene.has(anim)).toBe(true);
    });
  });
});
