/**
 *	B-Tree
 */
'use strict';

var Bt = Bt || {};

Bt.Node = function(k, data) {
  this.key = k; // integer
  this.parent = null; // Node
  this.left = null; // Node
  this.right = null; // Node

  this.data = data; // any
};

Bst.BSTree = function() {
  this.root = null; // root node

  this.search = function(k) {
    return search(this.root, k);
  };

  this.minimum = function() {
    return minimum(this.root);
  };

  this.maximum = function() {
    return maximum(this.root);
  };

  this.successor = function(node) {
    if (node.right != null) return minimum(node.right);

    if (node.parent == null) return null;

    var s = node.parent;
    while (s != null && node == s.right) {
      node = s;
      s = s.parent;
    }
    return s;
  };

  this.predecessor = function(node) {
    if (node.left != null) return maximum(node.left);

    if (node.parent == null) return null;

    var s = node.parent;
    while (s != null && node == s.left) {
      node = s;
      s = s.parent;
    }
    return s;
  };

  this.insert = function(node) {
    var y = null;
    var r = this.root;
    while (r != null) {
      y = r;
      r = (node.key < r.key) ? r.left : r.right;
    }
    node.parent = y;
    if (y == null)
      this.root = node;
    else if (node.key < y.key)
      y.left = node;
    else
      y.right = node;
  };

  this.rename = function(node) {
    if (node == null) return null;

    var ny = (node.left == null || node.right == null) ? node : this.successor(node);
    var nx = (ny.left != null) ? ny.left : ny.right;

    if (nx != null) {
      nx.parent = ny.parent;
    }

    if (ny.parent == null) {
      this.root = nx;
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
  };

  this.inorder = function() {
    inorder(this.root);
  };

  this.display = function() {
    display(this.root, 0);
  };

  /** Private methods */
  function search(node, k) {
    if (node == null || node.key == k)
      return node;

    return search((node.key > k) ? node.left : node.right, k);
  }

  function minimum(n) {
    var m = n;
    while (m.left != null) m = m.left;
    return m;
  }

  function maximum(n) {
    var m = n;
    while (m.right != null) m = m.right;
    return m;
  }

  function inorder(node) {
    if (node != null) {
      inorder(node.left);
      console.info(node.key);
      inorder(node.right);
    }
  }

  function display(node, indent) {
    if (node != null) {
      display(node.right, indent + 2);
      console.info(" ".repeat(indent), node.key);
      display(node.left, indent + 2);
    }
  }
  
}
