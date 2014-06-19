Zepto(function($){
	var App = {
		searchResultTemplate : Handlebars.compile( $('#search-results-tmpl').html() ),
		recentSearchTemplate : Handlebars.compile( $('#recent-search-tmpl').html() ),
		searchResultsContainer : '#search-results',
		recentSearchContainer : '#recent-searches',
		searchResults : [],
		searchUrl : "http://www.omdbapi.com/?s=",
		detailsUrl  : "http://www.omdbapi.com/?i=",
		searchMovies : function(searchTerm){
			
			if(searchTerm === undefined)
                searchTerm = "";			
			
			$.getJSON(App.searchUrl + searchTerm, function(data){
                var searchResultLength;
                    
                if( !data.Search )
                    searchResultLength = 0;
                else
                    searchResultLength = data.Search.length;
                    
                App.updateRecentSearch(searchTerm, searchResultLength);
                App.updateSearchResults(searchTerm, data);
            });	
		},
		updateSearchResults : function(searchTerm, data){
            
            if(!data.Search)
                App.updateTemplate(App.searchResultsContainer, App.searchResultTemplate, { term: searchTerm, noResults : true });
            else
                App.updateTemplate(App.searchResultsContainer, App.searchResultTemplate, { term: searchTerm, noResults : false, movies : data.Search});                
            
			var searches = App.getRecentSearches();
			App.updateTemplate(App.recentSearchContainer, App.recentSearchTemplate, { searches : searches});
		},
        getRecentSearches : function(){
            return JSON.parse(localStorage.getItem('recentSearches') || []);
        },
		updateRecentSearch : function(searchTerm, resultLength){
			var searches = App.getRecentSearches();
			searches.unshift({ term : searchTerm, count : resultLength});

			localStorage.setItem('recentSearches', JSON.stringify(searches));
		},
		updateTemplate : function(selector, template, data){
			$(selector).html(template(data));
		},
		init : function(){
			$('#movie-search input[type=submit]').on('click', function(event){
                event.preventDefault();
                
                var term = $('#movie-search input[type=text]').val();
                App.searchMovies(term);
            });

			if(!localStorage.getItem('recentSearches'))
				localStorage.setItem('recentSearches', JSON.stringify([]));
            
            App.searchMovies('Bourne');
		}
	};
    
    
	App.init();
});
