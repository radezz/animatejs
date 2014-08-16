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
    animatejs.Animation.prototype.set = function() {};
    animatejs.Animation.prototype.play = function() {};
    animatejs.Animation.prototype.pause = function() {};
    animatejs.Animation.prototype.isRunning = function() {
      return false;
    };
    animatejs.Animation.prototype.setParentScene = function() {
      return null;
    };
    animatejs.Animation.prototype.getParentScene = function() {
      return null;
    };
    animatejs.Animation.prototype.getDuration = function() {
      return 100;
    };
    animatejs.Animation.prototype.isLooping = function() {
      return false;
    };

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

    it('removes animation from previous scene', function() {
      var scene1 = new animatejs.Scene();
      animationMock.getParentScene = function() {
        return scene1;
      };
      spyOn(scene1, 'remove');
      scene.add(10, animationMock);
      expect(scene1.remove).toHaveBeenCalledWith(animationMock);
    });

    it('adds on dispose callback which removes animation if disposed', function() {
      var onDisposeClb;
      animationMock.addOnDisposeCallback = function(clb) {
        onDisposeClb = clb;
      };
      spyOn(scene, 'remove');
      scene.add(10, animationMock);
      onDisposeClb();
      expect(scene.remove).toHaveBeenCalledWith(animationMock);
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

  describe('set', function() {
    var anim1,
        anim2;
    beforeEach(function() {
      anim1 = new animatejs.Animation();
      anim2 = new animatejs.Animation();
      anim1.getDuration = anim2.getDuration = function() {
        return 100;
      };
      anim1.isRunning = anim2.isRunning = function() {
        return true;
      };
      spyOn(anim1, 'set');
      spyOn(anim2, 'set');
    });

    it('should start animations if not running', function() {
      scene.add(10, anim1);
      scene.add(30, anim2);
      spyOn(anim1, 'play');
      spyOn(anim2, 'play');
      anim1.isRunning = anim2.isRunning = function() {
        return false;
      };
      scene.set(35);
      expect(anim1.play).toHaveBeenCalledWith(25);
      expect(anim2.play).toHaveBeenCalledWith(5);
    });

    it('set all animations to proper time', function() {
      scene.add(10, anim1);
      scene.add(30, anim2);
      scene.set(35);
      expect(anim1.set).toHaveBeenCalledWith(25);
      expect(anim2.set).toHaveBeenCalledWith(5);
    });

    it('should set looping animations properly', function() {
      anim1.getDuration = function() {
        return 10;
      };
      anim1.isLooping = function() {
        return true;
      };
      scene.add(10, anim1);
      scene.add(30, anim2);
      scene.set(37);
      expect(anim1.set).toHaveBeenCalledWith(7);
    });

    it('should stop entire scene if value greater than duration', function() {
      spyOn(scene, 'stop');
      scene.set(400);
      expect(scene.stop).toHaveBeenCalled();
    });

  });

  describe('stop', function() {
    var anim1,
        anim2;
    beforeEach(function() {
      anim1 = new animatejs.Animation();
      anim2 = new animatejs.Animation();
      anim1.getDuration = anim2.getDuration = function() {
        return 100;
      };
      anim1.isRunning = anim2.isRunning = function() {
        return true;
      };
      scene.add(10, anim1);
      scene.add(30, anim2);
    });

    it('stops all running animations', function() {
      spyOn(anim1, 'stop');
      spyOn(anim2, 'stop');
      scene.stop();
      expect(anim1.stop).toHaveBeenCalled();
      expect(anim2.stop).toHaveBeenCalled();
    });
  });

  describe('pause', function() {
    var anim1,
        anim2;
    beforeEach(function() {
      anim1 = new animatejs.Animation();
      anim2 = new animatejs.Animation();
      anim1.getDuration = anim2.getDuration = function() {
        return 100;
      };
      anim1.isRunning = anim2.isRunning = function() {
        return true;
      };
      scene.add(10, anim1);
      scene.add(30, anim2);
    });

    it('pauses all running animations', function() {
      spyOn(anim1, 'pause');
      spyOn(anim2, 'pause');
      scene.pause();
      expect(anim1.pause).toHaveBeenCalled();
      expect(anim2.pause).toHaveBeenCalled();
    });
  });

  describe('destroy', function() {
    var anim1,
        anim2;

    beforeEach(function() {
      anim1 = new animatejs.Animation();
      anim2 = new animatejs.Animation();
      anim1.getDuration = anim2.getDuration = function() {
        return 100;
      };
      scene.add(10, anim1);
      scene.add(30, anim2);
    });

    it('removes all animations from the registry', function() {
      scene.destroy();
      expect(scene.getAnimationEntries().length).toBe(0);
    });
  });

  describe('has', function() {
    it('returns true if animation is already part of the scene', function() {
      var anim = new animatejs.Animation();
      scene.add(10, anim);
      expect(scene.has(anim)).toBe(true);
    });
  });

  describe('getDuration', function() {
    it('returns duration of entire scene', function() {
      var anim1,
          anim2;
      anim1 = new animatejs.Animation();
      anim2 = new animatejs.Animation();
      anim1.getDuration = anim2.getDuration = function() {
        return 100;
      };
      scene.add(10, anim1);
      scene.add(30, anim2);
      expect(scene.getDuration()).toBe(130);
    });
  });

});
