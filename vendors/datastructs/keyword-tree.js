/*jslint devel: true */
/*jslint node: true */
'use strict';

/**
 * Keyword Tree Data structure (Trie)
 * 
 */
var Trie = Trie || {};

/**
 * 
 */
Trie.Node = function(k, value, data) {
	this.data = data; // any

	this.key = k || null;
	this.value = value;
	this.children = {};
};

/**
 * 
 */
Trie.Tree = function() {

	var self = this;

	/* public methods */
	self.add = add;
	self.search = search;
	self.remove = remove;
	self.print = print;

	/* private vars */
	var root = {
		key : '',
		children : {}
	}; // root node

	function print() {
		console.log('print');
		console.log(root.key);
		printChildren(root, 0);
	}

	function printChildren(node, indent) {
		for ( var k in node.children) {
			if (node.children.hasOwnProperty(k)) {
				var val = node.children[k];
				console.log(" ".repeat(indent), val.key);
				printChildren(val, indent + 2);
			}
		}
	}

	function add(word, data) {
		var curNode = root, 
			newNode = null, 
			curChar = word.slice(0, 1);

		word = word.slice(1);

		while (typeof curNode.children[curChar] !== "undefined" && word.length > 0) {
			curNode = curNode.children[curChar];
			curChar = word.slice(0, 1);
			word = word.slice(1);
		}
		if (word.length === 0 && curNode.children[curChar]) {
			curNode.children[curChar].value = null;
			curNode.children[curChar].data = data;
		} else {
			while (curChar.length > 0) {
				newNode = new Trie.Node(curChar, word.length === 0 ? null : undefined, data);
				curNode.children[curChar] = newNode;
				curNode = newNode;
				curChar = word.slice(0, 1);
				word = word.slice(1);
			}
		}

	}

	function search(key) {
		var curNode = root, curChar = key.slice(0, 1), d = 0;

		key = key.slice(1);

		while (typeof curNode.children[curChar] !== "undefined" && curChar.length > 0) {
			curNode = curNode.children[curChar];
			curChar = key.slice(0, 1);
			key = key.slice(1);
			d += 1;
		}

		if (curNode.value === null && key.length === 0) {
			return curNode.data;
		} else {
			return null;
		}
	}

	function remove(word) {
		var d = search(word);
		if (d) {
			removeH(root, word, d);
		}
	}

	function removeH(node, key, depth) {
		if (depth === 0 && Object.keys(node.children).length === 0) {
			return true;
		}

		var curChar = key.slice(0, 1);

		if (removeH(node.children[curChar], key.slice(1), depth - 1)) {
			delete node.children[curChar];
			if (Object.keys(node.children).length === 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
