(function() {
	'use strict';

	angular
		.module('dictionary')
		.factory('DataService', DataService);

	DataService.$inject = [ '$http' ];

	function DataService($http) {
		return {
			getLanguages : getLanguages,
			getLanguage : getLanguage
		};

		function get(url) {
			return $http.get(url).then(getComplete, getFailed);

			function getComplete(response) {
				return response.data;
			}

			function getFailed(error) {
				console.error('XHR Failed for ' + url + ': ' + error.data);
			}
		}

		function getLanguages() {
			return get('data/languages.json');
		}

		function getLanguage(source) {
			return get('data/' + source);
		}
	}
})();
