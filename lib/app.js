$(function(){
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
                
                var searchResults = App.validateServerResponse(data, searchTerm);
                    
                App.updateRecentSearch(data.term, data.resultCount);
                App.updateSearchResults(data);
            });	
		},
        validateServerResponse : function(data, term){
            
            if(!data.Search){
                data.resultCount = 0;
                data.noResults = true;
            } else {
                data.resultCount = data.Search.length;
                data.noResults = false;
            }
            data.term = term;
            
            return data;
        },
		updateSearchResults : function(data){
            
            App.updateTemplate(App.searchResultsContainer, App.searchResultTemplate, { term: data.term, noResults : data.noResults, movies : data.Search });                
            
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
            
            $('#recent-searches').on('click', '.search-link', function(){
                var term = $(this).attr('data-search-term');
                
                App.searchMovies(term);
            });

			if(!localStorage.getItem('recentSearches'))
				localStorage.setItem('recentSearches', JSON.stringify([]));
            
            App.searchMovies('Bourne');
		}
	};
    
    
	App.init();
});
