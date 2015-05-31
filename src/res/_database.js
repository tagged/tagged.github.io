var Set = require('collections/set');
var SortedSet = require('collections/sorted-set');

var Immutable = require('immutable');

//Treat files as read-only
var _Files = require('./_files');
var _files = Immutable.Map(_Files);

module.exports = {

  //Eventually move to database logic

  getFiles: function(tags) {
    //Get files with all specified tags
    //Return Immutable Map

    if (tags.length === 0) {
      return Immutable.Map();
    }
    
    var tagSet = Set(tags);
    
    var _newFiles = _files.filter(function(file, fileId) {
      //Keep only files that contain all tags
      return tagSet.intersection(Set(file.tags)).length === tagSet.length;
    });

    return _newFiles;
  },

  getTags: function() {
    //Calculate tags from files
    var tags = SortedSet();
    _files.forEach(function(file) {
      tags = tags.union(file.tags);
    });
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

      //Tags on files containing all search tags AND start with search value 
      //(empty string starts every string)
      suggestedTags = SortedSet();
      searchTagSet = Set(searchTags);
      _files.forEach(function(file) {
        var fileTags = Set(file.tags);
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
      });
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