goog.require('animatejs.util.LinkedList');


describe('animatejs.util.LinkedList', function() {
  'use strict';
  var ll;

  beforeEach(function() {
    ll = new animatejs.util.LinkedList();
  });

  afterEach(function() {
    ll.dispose();
  });

  describe('constructor', function() {
    it('initializes the list', function() {
      expect(ll.getHead()).toBe(null);
      expect(ll.getTail()).toBe(null);
      expect(ll.getLength()).toBe(0);
    });
  });

  describe('getHead', function() {
    it('returns head element from the list', function() {
      var el1 = new animatejs.util.LinkedListElement(),
          el2 = new animatejs.util.LinkedListElement();
      ll.link(el1);
      ll.link(el2);
      expect(ll.getHead()).toBe(el2);
    });
  });

  describe('getTail', function() {
    it('returns tail element from the list', function() {
      var el1 = new animatejs.util.LinkedListElement(),
          el2 = new animatejs.util.LinkedListElement();
      ll.link(el1);
      ll.link(el2);
      expect(ll.getTail()).toBe(el1);
    });
  });

  describe('getLength', function() {
    it('returns number of elements on the list', function() {
      var el1 = new animatejs.util.LinkedListElement(),
          el2 = new animatejs.util.LinkedListElement();
      ll.link(el1);
      ll.link(el2);
      expect(ll.getLength()).toBe(2);
    });
  });

  describe('link', function() {
    it('links element to list head', function() {
      var el1 = new animatejs.util.LinkedListElement(),
          el2 = new animatejs.util.LinkedListElement();
      ll.link(el1);
      ll.link(el2);
      expect(ll.getTail()).toBe(el1);
      expect(ll.getHead()).toBe(el2);
      expect(el1.next).toBe(el2);
      expect(el2.prev).toBe(el1);
    });

    it('links element before provided element', function() {
      var el1 = new animatejs.util.LinkedListElement(),
          el2 = new animatejs.util.LinkedListElement(),
          el3 = new animatejs.util.LinkedListElement();
      ll.link(el1);
      ll.link(el2);
      ll.link(el3, el2);
      expect(el3.prev).toBe(el1);
      expect(el3.next).toBe(el2);
      expect(ll.getTail()).toBe(el1);
      expect(ll.getHead()).toBe(el2);
    });

    it('links element before tail', function() {
      var el1 = new animatejs.util.LinkedListElement(),
          el2 = new animatejs.util.LinkedListElement(),
          el3 = new animatejs.util.LinkedListElement();
      ll.link(el1);
      ll.link(el2);
      ll.link(el3, ll.getTail());
      expect(el1.prev).toBe(el3);
      expect(el1.next).toBe(el2);
      expect(ll.getTail()).toBe(el3);
      expect(ll.getHead()).toBe(el2);
    });
  });
});


