#Search All The Movies!
A simple one-page app to search the IMDB via the [omdb api](http://www.omdbapi.com/).

##Changelog

### Version .1
- Included basic searching, not styled much. 
- Store recent searches in localStorage

### Version .2
- Handles no results
- Show recent searches in reverse chronological order
- Init page to show recent searches
- Added result count to recent searches
- Added method to get recent searches consistently
- Adjusted style of recent searches
    - Include search result count
    - Use bootstrap element
    - Handle search of empty string (recent search listing would collapse with no text)
- Adjusted style of result elements 
- Added this readme.

### Version .3
- Recent searches are now links to bring up those results
- Refactored server response validation to a single method instead of sprawled out. 
- Cached server response in localstorage to prevent dupe network calls