/*jslint devel: true */
/*jslint node: true */
'use strict';

/**
 *	Red-Black Trees
 */

var Rbt = Rbt || {};

Rbt.Color = {
  RED: 'R',
  BLACK: 'B'
};

Rbt.Node = function(k, data) {
  this.data = data; // any
  
  this.key = k; // integer
  this.parent = (k === 0) ? this : Rbt.NULL; // Node
  this.left = (k === 0) ? this : Rbt.NULL; // Node
  this.right = (k === 0) ? this : Rbt.NULL; // Node
  this.color = Rbt.Color.BLACK; // Rbt.Color.RED | Rbt.Color.BLACK
};

Rbt.NULL = new Rbt.Node(0);

Rbt.Tree = function() {
  
  var self = this;
  
  /* private vars */
  var root = Rbt.NULL; // root node

  /* public methods */
  self.search = searchNode;
  self.minimum = minimumNode;
  self.maximum = maximumNode;
  self.successor = successor;
  self.predecessor = predecessor;
  self.insert = insert;
  self.remove = remove;
  self.inorderNodes = inorderNodes;
  self.displayTree = displayTree;
  
  /* Private methods */
  
  function searchNode(k) {
    return search(root, k);
  }

  function minimumNode() {
    return minimum(root);
  }

  function maximumNode() {
    return maximum(root);
  }

  function successor(node) {
    if (node.right != Rbt.NULL) return minimum(node.right);

    if (node.parent == Rbt.NULL) return Rbt.NULL;

    var s = node.parent;
    while (s != Rbt.NULL && node == s.right) {
      node = s;
      s = s.parent;
    }
    return s;
  }

  function predecessor(node) {
    if (node.left != Rbt.NULL) return maximum(node.left);

    if (node.parent == Rbt.NULL) return Rbt.NULL;

    var s = node.parent;
    while (s != Rbt.NULL && node == s.left) {
      node = s;
      s = s.parent;
    }
    return s;
  }

  function insert(node) {
    var y = Rbt.NULL;
    var r = root;

    while (r != Rbt.NULL) {
      y = r;
      r = (node.key < r.key) ? r.left : r.right;
    }

    node.parent = y;

    if (y == Rbt.NULL)
      root = node;
    else if (node.key < y.key)
      y.left = node;
    else
      y.right = node;

    node.left = node.right = Rbt.NULL;
    node.color = Rbt.Color.RED;
    
    insertFixup(node);
  }

  function remove(node) {
    if (node == Rbt.NULL) return Rbt.NULL;

    var ny = (node.left == Rbt.NULL || node.right == Rbt.NULL) ? node : successor(node);
    var nx = (ny.left != Rbt.NULL) ? ny.left : ny.right;

    nx.parent = ny.parent;

    if (ny.parent == Rbt.NULL) {
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

    if (ny.color == Rbt.Color.BLACK)
      deleteFixup(nx);

    return ny;
  }

  function inorderNodes() {
    var nodes = [];
    inorder(root, nodes);
    return nodes;
  }

  function displayTree() {
    display(root, 0);
  }

  /** Private methods */
  function search(node, k) {
    if (node == Rbt.NULL || node.key == k)
      return node;

    return search((node.key > k) ? node.left : node.right, k);
  }

  function minimum(n) {
    var m = n;
    while (m.left != Rbt.NULL) m = m.left;
    return m;
  }

  function maximum(n) {
    var m = n;
    while (m.right != Rbt.NULL) m = m.right;
    return m;
  }

  function inorder(node, nodes) {
    if (node != Rbt.NULL) {
      inorder(node.left, nodes);
      nodes.push(node);
      inorder(node.right, nodes);
    }
  }

  function display(node, indent) {
    if (node != Rbt.NULL) {
      display(node.right, indent + 2);
      console.info(" ".repeat(indent), node.key + ":" + node.color);
      display(node.left, indent + 2);
    }
  }

  function leftRotate(node) {
    var ny = node.right;

    node.right = ny.left;
    if (ny.left != Rbt.NULL)
      ny.left.parent = node;

    ny.parent = node.parent;
    if (node.parent == Rbt.NULL)
      root = ny;
    else if (node == node.parent.left)
      node.parent.left = ny;
    else
      node.parent.right = ny;

    ny.left = node;
    node.parent = ny;
  }

  function rightRotate(node) {
    var ny = node.left;

    node.left = ny.right;
    if (ny.right != Rbt.NULL)
      ny.right.parent = node;

    ny.parent = node.parent;
    if (node.parent == Rbt.NULL)
      root = ny;
    else if (node == node.parent.left)
      node.parent.left = ny;
    else
      node.parent.right = ny;

    ny.right = node;
    node.parent = ny;
  }

  function insertFixup(node) {
    var y;
    while (node.parent.color == Rbt.Color.RED) {
      if (node.parent == node.parent.parent.left) {
        y = node.parent.parent.right;
        if (y.color == Rbt.Color.RED) {
          node.parent.color = Rbt.Color.BLACK;
          y.color = Rbt.Color.BLACK;
          node.parent.parent.color = Rbt.Color.RED;
          node = node.parent.parent;
        } else {
          if (node == node.parent.right) {
            node = node.parent;
            leftRotate(node);
          }
          node.parent.color = Rbt.Color.BLACK;
          node.parent.parent.color = Rbt.Color.RED;
          rightRotate(node.parent.parent);
        }
      } else {
        y = node.parent.parent.left;
        if (y.color == Rbt.Color.RED) {
          node.parent.color = Rbt.Color.BLACK;
          y.color = Rbt.Color.BLACK;
          node.parent.parent.color = Rbt.Color.RED;
          node = node.parent.parent;
        } else {
          if (node == node.parent.left) {
            node = node.parent;
            rightRotate(node);
          }
          node.parent.color = Rbt.Color.BLACK;
          node.parent.parent.color = Rbt.Color.RED;
          leftRotate(node.parent.parent);
        }
      }
    }
    root.color = Rbt.Color.BLACK;
  }

  function deleteFixup(node) {
    var w;
    while ((node != root) && (node.color == Rbt.Color.BLACK)) {
      if (node == node.parent.left) {
        w = node.parent.right;
        if (w.color == Rbt.Color.RED) {
          w.color = Rbt.Color.BLACK;
          node.parent.color = Rbt.Color.RED;
          leftRotate(node.parent);
          w = node.parent.right;
        }
        if ((w.left.color == Rbt.Color.BLACK) && (w.right.color == Rbt.Color.BLACK)) {
          w.color = Rbt.Color.RED;
          node = node.parent;
        } else {
          if (w.right.color == Rbt.Color.BLACK) {
            w.left.color = Rbt.Color.BLACK;
            w.color = Rbt.Color.RED;
            rightRotate(w);
            w = node.parent.right;
          }
          w.color = node.parent.color;
          node.parent.color = Rbt.Color.BLACK;
          w.right.color = Rbt.Color.BLACK;
          leftRotate(node.parent);
          node = root;
        }
      } else {
        w = node.parent.left;
        if (w.color == Rbt.Color.RED) {
          w.color = Rbt.Color.BLACK;
          node.parent.color = Rbt.Color.RED;
          rightRotate(node.parent);
          w = node.parent.left;
        }
        if ((w.left.color == Rbt.Color.BLACK) && (w.right.color == Rbt.Color.BLACK)) {
          w.color = Rbt.Color.RED;
          node = node.parent;
        } else {
          if (w.left.color == Rbt.Color.BLACK) {
            w.right.color = Rbt.Color.BLACK;
            w.color = Rbt.Color.RED;
            leftRotate(w);
            w = node.parent.left;
          }
          w.color = node.parent.color;
          node.parent.color = Rbt.Color.BLACK;
          w.left.color = Rbt.Color.BLACK;
          rightRotate(node.parent);
          node = root;
        }
      }
    }
    node.color = Rbt.Color.BLACK;
  }
};
