Zepto(function($){
	var App = {
		searchResultTemplate : Handlebars.compile( $('#search-results-tmpl').html() ),
		recentSearchTemplate : Handlebars.compile( $('#recent-search-tmpl').html() ),
		searchResultsContainer : '#search-results',
		recentSearchContainer : '#recent-searches',
		searchResults : [],
		searchUrl : "http://www.omdbapi.com/?s=",
		detailsUrl  : "http://www.omdbapi.com/?i=",
		searchMovies : function(event){
			event.preventDefault();
			
			var searchTerm = $('#movie-search input[type=text]').val();
			App.updateRecentSearch(searchTerm);
			$.getJSON(App.searchUrl + searchTerm, App.updateSearchResults);	
		},
		updateSearchResults : function(data){
			App.updateTemplate(App.searchResultsContainer, App.searchResultTemplate, { movies : data.Search});
			var searches = JSON.parse(localStorage.getItem('recentSearches'));
			App.updateTemplate(App.recentSearchContainer, App.recentSearchTemplate, { terms : searches});
		},
		updateRecentSearch : function(searchTerm){
			var searches = JSON.parse(localStorage.getItem('recentSearches'));
			searches.push(searchTerm);

			localStorage.setItem('recentSearches', JSON.stringify(searches));
		},
		updateTemplate : function(selector, template, data){
			$(selector).html(template(data));
		},
		init : function(){
			$('#movie-search input[type=submit]').on('click', App.searchMovies);

			if(!localStorage.getItem('recentSearches'))
				localStorage.setItem('recentSearches', JSON.stringify([]));
		}
	};

	App.init();
});
