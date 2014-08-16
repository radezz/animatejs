goog.require('animatejs.KeyFrameList');


describe('animatejs.KeyFrameList', function() {
  'use strict';

  describe('constructor', function() {
    it('creates key frame list instance', function() {
      expect(function() {
        var kframes = new animatejs.KeyFrameList({
          'prop': 0
        });
        expect(kframes).toBeDefined();
        expect(kframes.frameProperties.indexOf('prop')).not.toBe(-1);

      }).not.toThrow();
    });

    it('throws exception if initial properties are not provided', function() {
      expect(function() {
        new animatejs.KeyFrameList();
      }).toThrow();
    });

    it('creates initial key frame at 0 with provided properties', function() {
      var kframes = new animatejs.KeyFrameList({
        'prop': 0,
        'secondProp': 1
      });

      expect(kframes.getTail().data['prop']).toBe(0);
      expect(kframes.getTail().data['secondProp']).toBe(1);
    });
  });

  describe('link', function() {
    it('throws exception if key frame properties are different', function() {
      var kframes = new animatejs.KeyFrameList({
        'prop': 0
      });

      expect(function() {
        kframes.link(new animatejs.KeyFrame(10, {
          'differentprop': 5
        }));
      }).toThrow();

      expect(function() {
        kframes.link(new animatejs.KeyFrame(10, {
          'prop': 5
        }));
      }).not.toThrow();

    });


  });

  describe('add', function() {
    it('adds key frame at proper position', function() {
      var kframes = new animatejs.KeyFrameList({
        'prop': 0
      }),
          fr2 = new animatejs.KeyFrame(15, {
            'prop': 5
          }),
          fr3 = new animatejs.KeyFrame(10, {
            'prop': 15
          }),
          list;

      kframes.add(fr2);
      kframes.add(fr3);
      list = kframes.getArray();
      expect(list[1]).toBe(fr3);
      expect(list[2]).toBe(fr2);
    });

    it('replaces key frame if at time is the same', function() {
      var kframes = new animatejs.KeyFrameList({
        'prop': 0
      }),
          fr2 = new animatejs.KeyFrame(15, {
            'prop': 5
          }),
          fr3 = new animatejs.KeyFrame(15, {
            'prop': 15
          }),
          list;

      kframes.add(fr2);
      kframes.add(fr3);
      list = kframes.getArray();
      expect(list[1]).toBe(fr3);
    });
  });

  describe('dispose', function() {
    it('destroys members correctly', function() {
      var kframes = new animatejs.KeyFrameList({
        'prop': 0
      });
      kframes.dispose();
      expect(kframes.frameProperties).toBe(null);
    });
  });

});

