goog.require('animatejs.AnimationFactory');


describe('animatejs.AnimationFactory', function() {
  'use strict';

  beforeEach(function() {

  });

  describe('create', function() {

    it('creates animation object from well formed spec', function() {
      var anim = animatejs.Animation.create([
        {
          at: '0%',
          properties: {
            'prop1': 1
          }
        },
        {
          at: '100x%',
          properties: {
            'prop1': 50
          }
        }
      ], 1000);
      expect(anim instanceof animatejs.Animation).toBe(true);
    });

    it('throws exception in case at time is badly formed', function() {
      expect(function() {
        animatejs.Animation.create([
          {
            at: '0%',
            properties: {
              'prop1': 1
            }
          },
          {
            at: 'xxx%',
            properties: {
              'prop1': 50
            }
          }
        ], 1000);
      }).toThrow();
    });

    it('throws exception when frames without properties is specified', function() {
      expect(function() {
        animatejs.Animation.create([
          {
            at: '0%'
          },
          {
            at: 'xxx%'
          }
        ], 1000);
      }).toThrow();
    });

    it('throws exception if no duration and frames times specify %', function() {
      expect(function() {
        animatejs.Animation.create([
          {
            at: '0%',
            properties: {
              'prop1': 1
            }
          },
          {
            at: '100%',
            properties: {
              'prop1': 50
            }
          }
        ]);
      }).toThrow();
    });

    it('throws exception if more than 100% specified in frame time', function() {
      expect(function() {
        animatejs.Animation.create([
          {
            at: '0%',
            properties: {
              'prop1': 1
            }
          },
          {
            at: '120%',
            properties: {
              'prop1': 50
            }
          }
        ]);
      }, 1000).toThrow();
    });

    it('throws exception if no start frame', function() {
      expect(function() {
        animatejs.Animation.create([
          {
            at: '10%',
            properties: {
              'prop1': 1
            }
          },
          {
            at: '100%',
            properties: {
              'prop1': 50
            }
          }
        ], 1000);
      }).toThrow();
    });

    it('throws exception if frame spec is not array', function() {
      expect(function() {
        animatejs.Animation.create('{spec}');
      }).toThrow();
    });

    it('throws exception if less than 2 frames are specified', function() {
      expect(function() {
        animatejs.Animation.create([]);
      }).toThrow();
      expect(function() {
        animatejs.Animation.create([
          {
            at: '0%',
            properties: {
              'prop1': 1
            }
          }
        ]);
      }).toThrow();
    });
  });

});
