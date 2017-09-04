(function() {
	'use strict';

	angular
		.module('dictionary')
		.controller('DictionaryController', DictionaryController);

	DictionaryController.$inject = [ 'DataService', '$q', '$timeout' ];

	function DictionaryController(DataService, $q, $timeout) {
		var self = this;

		self.languages = [];
		self.translateFrom = null;
		self.translateTo = null;
		self.translationNotFound = false;
		self.wordNotFound = false;

		self.addNewWord = addNewWord;
		self.addTranslation = addTranslation;
		self.translateFromChanged = translateFromChanged;
		self.translateToChanged = translateToChanged;
		self.searchWordChanged = searchWordChanged;

		var translateFrom = null;
		var translateTo = null;
		var fromLanguage = {
			hash : null,
			tree : null,
			trie : null,
			wordsCount : 0
		};
		var toLanguage = {
			hash : null,
			tree : null,
			trie : null,
			wordsCount : 0
		};
		var searchTimeout = null;
		var searchedWord = null;

		init();

		function init() {
			loadLanguages().then(function() {
				var fromP = setFromLanguage(self.languages[0]);
				var toP = setToLanguage(self.languages[1]);

				$q.all([ fromP, toP ]).then(function() {
					console.log('done!');
					console.log(fromLanguage.trie.search('roz'));
				});
			});
		}

		function addNewWord() {
			fromLanguage.wordsCount += 1;

			var newWord = {
				id : fromLanguage.wordsCount,
				word : translateFrom.word
			};

			fromLanguage.hash[newWord.word] = newWord;
			fromLanguage.tree.insert(new Rbt.Node(newWord.id, newWord));
			fromLanguage.trie.add(newWord.word, newWord);

			searchWord();
		}

		function addTranslation() {
			toLanguage.wordsCount += 1;

			var newWord = {
				id : searchedWord.id,
				word : self.translateTo.word
			};

			toLanguage.hash[newWord.word] = newWord;
			toLanguage.tree.insert(new Rbt.Node(newWord.id, newWord));
			toLanguage.trie.add(newWord.word, newWord);

			searchWord();
		}

		function setFromLanguage(language) {
			self.translateFrom = language;
			translateFrom = language;

			return loadLanguage(self.translateFrom, fromLanguage);
		}

		function setToLanguage(language) {
			self.translateTo = language;
			translateTo = language;

			return loadLanguage(self.translateTo, toLanguage);
		}

		function loadLanguage(language, dictionary) {
			return DataService.getLanguage(language.source).then(
					function(data) {
						dictionary.hash = {};
						dictionary.tree = new Rbt.Tree();
						dictionary.trie = new Trie.Tree();
						dictionary.wordsCount = data.length;
						for (var i = 0; i < data.length; i++) {
							dictionary.hash[data[i].word] = data[i];
							dictionary.tree.insert(new Rbt.Node(data[i].id, data[i]));
							dictionary.trie.add(data[i].word, data[i]);
						}
					});
		}

		function loadLanguages() {
			return DataService.getLanguages().then(function(data) {
				self.languages = data;
			});
		}

		function translateFromChanged() {
			if (self.translateFrom == self.translateTo) {
				self.translateTo = translateFrom;
				translateTo = translateFrom;
				translateFrom = self.translateFrom;

				// swap languages;
				var fl = fromLanguage;
				fromLanguage = toLanguage;
				toLanguage = fl;
			}
		}

		function translateToChanged() {
			if (self.translateFrom == self.translateTo) {
				self.translateFrom = translateTo;
				translateFrom = translateTo;
				translateTo = self.translateTo;

				// swap languages;
				var fl = fromLanguage;
				fromLanguage = toLanguage;
				toLanguage = fl;
			}
		}

		function searchWordChanged() {
			if (translateFrom.word.length > 1) {
				if (searchTimeout) {
					$timeout.cancel(searchTimeout);
				}
				searchTimeout = $timeout(searchWord, 500);
			}
		}

		function searchWord() {
			searchedWord = searchInDictionary(translateFrom.word);

			if (searchedWord) {
				self.wordNotFound = false;
				var translation = findTranslation(searchedWord);
				if (translation) {
					self.translationNotFound = false;
					self.translateTo.word = translation.data.word;
				} else {
					self.translationNotFound = true;
					self.translateTo.word = translateFrom.word;
				}
			} else {
				self.wordNotFound = true;
				self.translateTo.word = translateFrom.word;
			}
		}

		function searchInDictionary(word) {
			return fromLanguage.trie.search(word);
		}

		function findTranslation(word) {
			var tr = toLanguage.tree.search(word.id);
			return (tr.key === 0) ? undefined : tr;
		}
	}
})();
