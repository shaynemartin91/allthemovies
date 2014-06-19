$(function(){
	var App = {
		searchResultTemplate : Handlebars.compile( $('#search-results-tmpl').html() ),
		recentSearchTemplate : Handlebars.compile( $('#recent-search-tmpl').html() ),
        detailsTemplate : Handlebars.compile( $('#movie-details-tmpl').html() ),
		searchResultsContainer : '#search-results',
		recentSearchContainer : '#recent-searches',
        movieDetailsContainer : '#details-container',
		searchResults : [],
		searchUrl : "http://www.omdbapi.com/?s=",
		detailsUrl  : "http://www.omdbapi.com/?i=",
		searchMovies : function(searchTerm){
			
			if(searchTerm === undefined)
                searchTerm = "";			
            
            var cachedResults = App.getCachedSearchResults(searchTerm);
            
            if(cachedResults !== undefined && cachedResults !== null){
                App.updateRecentSearch(cachedResults.term, cachedResults.resultCount);
                App.updateSearchResults(cachedResults);
            } else {
                $.getJSON(App.searchUrl + searchTerm, function(data){
                    
                    var searchResults = App.validateServerResponse(data, searchTerm);
                        
                    App.updateRecentSearch(data.term, data.resultCount);
                    App.updateSearchResults(data);
                    App.cacheSearchResults(searchResults);
                });	
            }
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
            
            for(var i=searches.length-1; i>=0; i--){
                if(searches[i].term.toLowerCase() == searchTerm.toLowerCase()){
                    searches.splice(i,1);
                }
            }
			
            searches.unshift({ term : searchTerm, count : resultLength});

			localStorage.setItem('recentSearches', JSON.stringify(searches));
		},
		updateTemplate : function(selector, template, data){
			$(selector).html(template(data));
		},
        cacheSearchResults : function(term, results){
            localStorage.setItem('search::' + term, JSON.stringify(results));
        },
        getCachedSearchResults : function(term){
            return localStorage.getItem('search::' + term);
        },
        showMovieDetails : function(movieId){
            $.getJSON(App.detailsUrl + movieId, function(){
                
            });
        },
		init : function(){
			$('#movie-search input[type=submit]').on('click', function(event){
                event.preventDefault();
                
                var term = $('#movie-search input[type=text]').val();
                App.searchMovies(term);
            });
            
            $('#recent-searches').on('click', '.search-link', function(){
                var term = $(this).data('search-term');
                
                App.searchMovies(term);
            });
            
            $('#search-results').on('click', '.movie-result', function(){
                var id = $(this).data('id');
                
                App.showMovieDetails(id);
            });

			if(!localStorage.getItem('recentSearches'))
				localStorage.setItem('recentSearches', JSON.stringify([]));
            
            App.searchMovies('Bourne');
		}
	};
    
    
	App.init();
});
