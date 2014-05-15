goog.require('animatejs.util.LinkedListElement');


describe('animatejs.util.LinkedListElement', function() {
  'use strict';

  describe('contructor', function() {
    it('creates linked list element instance', function() {
      var listElem = new animatejs.util.LinkedListElement();
      expect(listElem.prev).toBe(null);
      expect(listElem.next).toBe(null);
      expect(listElem.data).toBe(null);
    });

    it('creates list element with data', function() {
      var data = {},
          listElem = new animatejs.util.LinkedListElement(data);
      expect(listElem.data).toBe(data);
    });
  });

  describe('setOwnerList/getOwnerList', function() {
    it('sets and reads owner list', function() {
      var owner = {},
          listElem = new animatejs.util.LinkedListElement();
      listElem.setOwnerList(owner);
      expect(listElem.getOwnerList()).toBe(owner);
    });
  });

});


