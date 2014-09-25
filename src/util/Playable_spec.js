goog.require('animatejs.util.Playable');

describe('animatejs.util.Playable', function() {
  'use strict';
  var playable,
      Playable;
  beforeEach(function() {
    Playable = function() {
      animatejs.util.Playable.apply(this, arguments);
    };
    goog.inherits(Playable, animatejs.util.Playable);
    Playable.prototype.onTime = function() {};
    playable = new Playable(100);
  });

  describe('constructor', function() {
    it('creates playable instance', function() {
      expect(function() {
        playable = new animatejs.util.Playable();
      }).not.toThrow();
      expect(playable).toBeDefined();
      expect(playable.isRunning()).toBe(false);
      expect(playable.isPaused()).toBe(false);
      expect(playable.getAtTime()).toBe(0);
    });
  });

  describe('play', function() {
    it('marks playable as playing and returns playable object', function() {
      expect(playable.play()).toBe(playable);
      expect(playable.isRunning()).toBe(true);
    });

    it('stops playable if running and runs again', function() {
      playable.play();
      spyOn(playable, 'stop').and.callThrough();
      playable.play();
      expect(playable.stop).toHaveBeenCalled();
    });

    it('dispatches start message if was idle', function() {
      var spy = jasmine.createSpy('start');
      playable.on('start', spy);
      playable.play();
      expect(spy).toHaveBeenCalled();
      expect(playable.getAtTime()).toBe(0);
    });

    it('sets at time if provided', function() {
      playable.play(10);
      expect(playable.getAtTime()).toBe(10);
    });
  });

  describe('stop', function() {
    it('marks playable as stopped, removes loop mark', function() {
      playable.play();
      playable.loop();
      playable.stop();
      expect(playable.isRunning()).toBe(false);
      expect(playable.isLooping()).toBe(false);
      expect(playable.getAtTime()).toBe(0);
    });
  });

  describe('pause', function() {
    it('marks playable object as paused', function() {
      playable.play();
      expect(playable.pause()).toBe(playable);
      expect(playable.isPaused()).toBe(true);
    });
  });

  describe('loop', function() {
    it('marks playable object as looping', function() {
      playable.loop();
      expect(playable.isLooping()).toBe(true);
    });
  });

  describe('set', function() {
    it('sets current time mark on playable object', function() {
      playable.set(100);
      expect(playable.getAtTime()).toBe(100);
    });
  });

  describe('getState', function() {
    it('returns current state of the playable object', function() {
      expect(playable.getState()).toBe(animatejs.util.Playable.State.IDLE);
    });
  });

  describe('setFrameRequester', function() {
    it('sets new frame requester which is used for fetching frames', function() {
      var requester = {
        requestAnimationFrame: function() {
          return 1;
        },
        cancelAnimationFrame: function() {}
      };
      spyOn(requester, 'requestAnimationFrame').and.callThrough();
      spyOn(requester, 'cancelAnimationFrame');
      playable.setFrameRequester(requester);
      playable.play();
      playable.stop();
      expect(requester.requestAnimationFrame).toHaveBeenCalled();
      expect(requester.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});



