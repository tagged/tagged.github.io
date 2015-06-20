//Eventually use real database logic

var Immutable = require('immutable');

var _cloud = require('./_cloud');

module.exports = {

  /**
   * Returns an array of all files deeply nested within given array
   */
  getFiles: function(contents) {
    var _files = [];
    contents.forEach(function(item) {
      if (item.isFolder) {
        _files = _files.concat(this.getFiles(item.contents));
      }
      else {
        _files.push(item);
      }
    }, this);
    return _files;
  },

  /**
   * Returns Immutable.List of files containing the specified tags
   *
   * @param tags Immutable.Set of tags guiding the file search
   */
  filterFiles: function(tags) {
    if (tags.isEmpty()) {
      return Immutable.List();
    }
    
    //Keep files that contain all tags
    var files = this.getFiles(_cloud).filter(function(file) {
      return tags.intersect(file.tags).size === tags.size;
    });

    return Immutable.List(files);
  },


  /**
   * Returns tags from all files. Return type is Immutable.OrderedSet.
   */
  getTags: function() {
    var tags = Immutable.Set();
    this.getFiles(_cloud).forEach(function(file) {
      tags = tags.union(file.tags);
    });
    return tags.sort();
  },
  
  
  /**
   * Returns Immutable.OrderedSet of tag suggestions based on 
   * specified search tags and search value
   * 
   * @param searchValue a string with which all returned tags should start
   * @param searchTags  Immutable.Set of tags with which all returned tags should share a file
   */
  makeSearchSuggestion: function(searchTags, searchValue) {

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

      //Tags on files that contain all search tags AND start with search value
      //(empty string starts every string)
      suggestedTags = Immutable.Set();
      searchTagSet = Immutable.Set(searchTags);
      this.getFiles(_cloud).forEach(function(file) {
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
      suggestedTags = suggestedTags.sort();

    }
    
    return {
      tags: suggestedTags,
      title: this.labelSuggestion(searchTags, searchValue, suggestedTags)
    };
  },
  


  /**
   * Returns an appropriate title for the given search value, search tags, and suggested tags.
   *
   * @param searchValue   the search value
   * @param searchTags    Immutable.Set of search tags
   * @param suggestedTags Immutable.Set of tags returned from makeSuggestion
   */
  labelSuggestion: function(searchTags, searchValue, suggestedTags) {
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
  },


  //Return Immutable.OrderedSet of tags starting with given value
  makeTaggerSuggestion: function(value) {
    var tags = this.getTags().filter(function(tag) {
      return tag.indexOf(value) === 0;
    });
    return tags;
  },


  /**
   * Return an object of folders and files at the specified path.
   * folders is an Immutable.List of folder names
   * files is an Immutable.List of file objects
   *
   * @param path an Immutable.List of strings representing a directory path
   */
  getContents: function(path) {
    var contents = _cloud;
    //follow folders along path
    path.forEach(function(folder) {
      contents = Immutable.List(contents).find(function(item) {
        return item.name === folder && item.isFolder;
      }).contents;
    });

    contents = Immutable.List(contents);

    var folders = contents.filter(function(item) {
      return item.isFolder;
    }).map(function(folder) {
      //Folder names only
      return folder.name;
    });

    var files = contents.filter(function(item) {
      return !item.isFolder;
    });

    return {
      folders: folders,
      files: files
    };
  }

};