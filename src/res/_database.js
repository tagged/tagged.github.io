var Set = require('collections/set');
var SortedSet = require('collections/sorted-set');

//Treat files as read-only
var _Files = require('./_files');

module.exports = {

  //Eventually move to database logic

  getAllFiles: function() {
    return _Files;
  },
  
  getFiles: function(tags) {
    //Get files with all specified tags

    var newFiles = [];
    
    if (tags.length === 0) {
      return newFiles;
    }
    
    var tagSet = Set(tags);
    var files = this.getAllFiles();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (tagSet.intersection(Set(file.tags)).length === tagSet.length) {
        //If file contains all tags, merge it into result
        newFiles.push(file);
      }
    }

    return newFiles;
  },

  getTags: function() {
    //Calculate tags from files
    var tags = SortedSet();
    for (var i = 0; i < _Files.length; i++) {
      tags = tags.union(_Files[i].tags);
    }
    return tags.toArray();
  },
  
  makeSuggestion: function(searchValue, searchTags) {
    //Make tag suggestions based on search value and search tags

    var suggestedTags;

    if (searchTags.length === 0) {

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

      //Tags on files containing all search tags AND start with search value (empty string starts every string)
      suggestedTags = SortedSet();
      searchTagSet = Set(searchTags);
      for (var i = 0; i < _Files.length; i++) {
        var fileTags = Set(_Files[i].tags);
        if (searchTagSet.intersection(fileTags).length === searchTagSet.length) { 
          //If file contains all search tags,
          //get all file tags that start with search value
          matchingFileTags = fileTags.filter(function(tag) {
            return tag.indexOf(searchValue) === 0;
          });
          //Exclude existing search tags (we're refining)
          matchingFileTags = matchingFileTags.difference(searchTagSet);
          //Merge into suggested tags
          suggestedTags = suggestedTags.union(matchingFileTags);
        }
      }
      suggestedTags = suggestedTags.toArray();

    }
    
    return suggestedTags;

  },
  
  labelSuggestion: function(searchValue, searchTags, suggestedTags) {
    //Determine subheader label from search tags, input value, and number of suggested tags
    var haveSuggestedTags = suggestedTags.length > 0;
    var label;
    if (searchValue === "") {
      if (searchTags.length === 0) {
        label = haveSuggestedTags ? "All " + suggestedTags.length + " tags" : "No tags exist yet";
      } else {
        label = haveSuggestedTags ? "Refine search" : "No tags to refine search";
      }
    } else {
      if (searchTags.length === 0) {
        label = haveSuggestedTags ? ('"' + searchValue + '" tags') : ('No "' + searchValue + '" tags');
      } else {
        label = haveSuggestedTags ? ('"' + searchValue + '" tags to refine search') : ('No "' + searchValue + '" tags to refine search');
      }
    }
    return label;
  }

};