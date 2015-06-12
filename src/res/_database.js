var Immutable = require('immutable');

//Treat files as read-only
var _Files = require('./_files');
var _files = Immutable.Map(_Files);

module.exports = {

  //Eventually move to database logic

  /**
   * Returns files with the specified tags
   * Return type is Immutable.Map
   *
   * @param tags The tags guiding the file search. 
   *             Type should be Immutable.List.
   */
  getFiles: function(tags) {

    if (tags.isEmpty()) {
      return Immutable.Map();
    }
    
    var tagSet = tags.toSet();
    
    var _newFiles = _files.filter(function(file, fileId) {
      //Keep only files that contain all tags
      return tagSet.intersect(file.tags).size === tagSet.size;
    });

    return _newFiles;
  },


  /**
   * Returns tags from all files. Return type is Immutable.List.
   */
  getTags: function() {
    var tags = Immutable.Set();
    _files.forEach(function(file) {
      tags = tags.union(file.tags);
    });
    return tags.toList().sort();
  },
  
  
  /**
   * Returns tags suggestions based on specified search tags and search value
   * Return type is Immutable.List
   *
   * @param searchValue The string with which all returned tags should start.
   * @param searchTags  The tags with which all returned tags should share a 
   *                    file. Immutable.List
   */
  makeSuggestion: function(searchValue, searchTags) {

    var suggestedTags;

    if (searchTags.isEmpty()) {

      if (searchValue === "") {
        //All tags
        suggestedTags = this.getTags();
      } else {
        //All tags starting with search value
        suggestedTags = this.getTags().filter(function(tag) {
          return tag.indexOf(searchValue) === 0;
        });
      }

    } else {

      //Tags on files containing all search tags AND start with search value 
      //(empty string starts every string)
      suggestedTags = Immutable.Set();
      searchTagSet = Immutable.Set(searchTags);
      _files.forEach(function(file) {
        var fileTags = Immutable.Set(file.tags);
        if (searchTagSet.intersect(fileTags).size === searchTagSet.size) { 
          //If file contains all search tags, get all 
          //file tags that start with search value
          matchingFileTags = fileTags.filter(function(tag) {
            return tag.indexOf(searchValue) === 0;
          });
          //Exclude existing search tags (we're refining)
          matchingFileTags = matchingFileTags.subtract(searchTagSet);
          //Merge into suggested tags
          suggestedTags = suggestedTags.union(matchingFileTags);
        }
      });
      suggestedTags = suggestedTags.toList().sort();

    }
    
    return suggestedTags;

  },
  

  /**
   * Returns tags suggestions based on specified search tags and search value
   * Return type is Immutable.List
   *
   * @param searchValue   The string with which all returned tags should start.
   * @param searchTags    The tags with which all returned tags should share a 
   *                      file. Immutable.List
   * @param suggestedTags The tags returned from makeSuggestion. Immutable.List
   */
  labelSuggestion: function(searchValue, searchTags, suggestedTags) {
    //Determine subheader label from search tags, input value, and number of suggested tags
    var haveSuggestedTags = suggestedTags.size > 0;
    var label;
    if (searchValue === "") {
      if (searchTags.isEmpty()) {
        label = haveSuggestedTags ? "All " + suggestedTags.size + " tags" : "No tags exist yet";
      } else {
        label = haveSuggestedTags ? "Refine search" : "No tags to refine search";
      }
    } else {
      if (searchTags.isEmpty()) {
        label = haveSuggestedTags ? ('"' + searchValue + '" tags') : ('No "' + searchValue + '" tags');
      } else {
        label = haveSuggestedTags ? ('"' + searchValue + '" tags to refine search') : ('No "' + searchValue + '" tags to refine search');
      }
    }
    return label;
  }

};