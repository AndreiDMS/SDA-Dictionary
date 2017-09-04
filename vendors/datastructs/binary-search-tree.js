/*jslint devel: true */
/*jslint node: true */
'use strict';

/**
 *  Binary Search Tree Data structure
 *  
 *  
 */

var Bst = Bst || {};

Bst.Node = function(k, data) {
  this.data = data; // any
  
  this.key = k; // integer
  this.parent = null; // Node
  this.left = null; // Node
  this.right = null; // Node
};

Bst.Tree = function() {
  
  var self = this;
  
  /* public methods */
  self.search = searchNode;
  self.minimum = minimumNode;
  self.maximum = maximumNode;
  self.successor = successor;
  self.predecessor = predecessor;
  self.insert = insert;
  self.remove = remove;
  self.displayInorder = displayInorder;
  self.displayTree = displayTree;
  
  /* private vars */
  var root = null; // root node
  
  /**
   * 
   */
  function searchNode(k) {
    return search(root, k);
  }
  
  /**
   * 
   */
  function search(node, k) {
    if (node === null || node.key == k)
      return node;

    return search((node.key > k) ? node.left : node.right, k);
  }

  /**
   * 
   */
  function minimumNode() {
    return minimum(root);
  }
  
  /**
   * 
   */
  function minimum(n) {
    var m = n;
    while (m.left !== null) m = m.left;
    return m;
  }

  /**
   * 
   */
  function maximumNode() {
    return maximum(root);
  }
  
  /**
   * 
   */
  function maximum(n) {
    var m = n;
    while (m.right !== null) m = m.right;
    return m;
  }

  /**
   * 
   */
  function successor(node) {
    if (node.right !== null) return minimum(node.right);

    if (node.parent === null) return null;

    var s = node.parent;
    while (s !== null && node == s.right) {
      node = s;
      s = s.parent;
    }
    return s;
  }

  /**
   * 
   */
  function predecessor(node) {
    if (node.left !== null) return maximum(node.left);

    if (node.parent === null) return null;

    var s = node.parent;
    while (s !== null && node == s.left) {
      node = s;
      s = s.parent;
    }
    return s;
  }

  /**
   * 
   */
  function insert(node) {
    var y = null;
    var r = root;
    while (r !== null) {
      y = r;
      r = (node.key < r.key) ? r.left : r.right;
    }
    node.parent = y;
    if (y === null)
      root = node;
    else if (node.key < y.key)
      y.left = node;
    else
      y.right = node;
  }

  /**
   * 
   */
  function remove(node) {
    if (node === null) return null;

    var ny = (node.left === null || node.right === null) ? node : successor(node);
    var nx = (ny.left !== null) ? ny.left : ny.right;

    if (nx !== null) {
      nx.parent = ny.parent;
    }

    if (ny.parent === null) {
      root = nx;
    } else {
      if (ny == ny.parent.left) {
        ny.parent.left = nx;
      } else {
        ny.parent.right = nx;
      }
    }

    if (ny != node) {
      node.key = ny.key;
      node.data = ny.data;
    }

    return ny;
  }
  
  /**
   * 
   */
  function inorder(node) {
    if (node !== null) {
      inorder(node.left);
      console.info(node.key);
      inorder(node.right);
    }
  }

  /**
   * 
   */
  function displayInorder() {
    inorder(root);
  }

  /**
   * 
   */
  function displayTree() {
    display(root, 0);
  }
  
  /**
   * 
   */
  function display(node, indent) {
    if (node !== null) {
      display(node.right, indent + 2);
      console.info(" ".repeat(indent), node.key);
      display(node.left, indent + 2);
    }
  }
  
};
