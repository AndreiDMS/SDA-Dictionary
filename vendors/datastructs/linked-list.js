/*jslint node: true */
"use strict"; 

/**
 *	Linked List Data Structure
 */

var Ll = Ll || {};

Ll.Node = function(data) {
  this.data = data; // any
  
  this.next = null; // Node
};

Ll.List = function() {
  
  var self = this;
  
  /* private vars */
  var root = null; // List head
  
  /* public methods */
  self.forEach = forEach;
  self.insertAfter = insertAfter;
  self.insertFirst = insertFirst;
  self.insert = insertFirst; // alias
  self.insertLast = insertLast;
  self.removeFirst = removeFirst;
  self.findByIdx = findByIdx;
  self.findBy = findBy;
  
  /* Private methods */
  
  /**
   * Executes a provided function once for each list element 
   * 
   * @param callback 
   */
  function forEach(callback) {
    var node = root;
    
    while (node){
      callback(node);
      node = node.next;
    }
  }
  
  /**
   * Insert newNode after node
   * 
   * @param node
   * @param newNode
   */
  function insertAfter(node, newNode) {
    newNode.next = node;
    node.next = newNode;
  }
  
  /**
   * Insert newNode at the begining of the list
   * 
   * @param newNode
   */
  function insertFirst(newNode) {
    newNode.next = root;
    root = newNode;
  }
  /**
   * Insert newNode at the end of the list
   * 
   * @param newNode
   */
  function insertLast(newNode) {
    self.forEach(function(node){
      if (node.next === null) node.next = newNode;
    });
  }
  
  /**
   * Removes the first node and returns it;
   */
  function removeFirst() {
    var node = root;
    root = root.next;
    node.next = null;
    return node;
  }

  /**
   * Retrieve a node by position in the list. 
   * Starts from 0. Returns null on overflow.
   * 
   * @param position
   * @return Ll.Node | null
   */
  function findByIdx(position) {
    var node = root; 
    var idx = 0;
    
    while (node && idx < position) {
      node = node.next; idx++;
    }
    return node;
  }
  
  /**
   * Find a node by value. If the node holds objects use the property parameter to search by object property.
   * 
   * @param value
   * @param property
   */
  function findBy(value, property) {
    var node = root;
    
    while (node) {
      if (typeof property !== 'undefined') {
        if (node.data[property] == value) break;
      }
      else {
        if (node.data == value) break;
      }
      node = node.next;
    }
    return node;
  }
};
