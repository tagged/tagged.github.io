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
   * Deletes files at specified paths.
   * Returns true if file is deleted,
   * or false if file is not found at path.
   * 
   * @param paths An array of file paths to be deleted
   *              Each path should be an array
   */
  deleteFiles: function(paths) {
    console.log('delete files in database');
    paths.forEach(function(path) {
      //Modify global
      _cloud = this._deleteFile(_cloud, path);
    }, this);
    return true;
  },

  /** 
   * Delete the file in array contents at the specified path
   * Recursive helper to deleteFiles
   * 
   * @param contents An array of folders and file items
   * @param path     An array representing the path to traverse
   * 
   * @throws "File does not exist"
   */
  _deleteFile: function(contents, path) {
    if (path.length === 1) {
      //No more folders to traverse
      //Return contents with filename removed
      var contentsMinusFile = contents.filter(function(item) {
        return item.isFolder || item.name !== path[0];
      });
      if (contents.length === contentsMinusFile.length) {
        throw "File does not exist";
      }
      return contentsMinusFile;
    }
    else {
      var modifiedContents = contents.map(function(item) {
        if (item.isFolder && item.name === path[0]) {
          item.contents = this._deleteFile(item.contents, path.slice(1));
        }
        return item;
      }, this);
      return modifiedContents;
    }
  },

  /**
   * Attaches specified tag from files at specified paths.
   * 
   * @param tag   The tag to attach to all files
   * @param paths An array of file paths
   *              Each path should be an array
   */
  attachTag: function(paths, tag) {
    console.log('attach tag in database');
    paths.forEach(function(path) {
      //Modify global
      _cloud = this._attachTagToFile(_cloud, path, tag);
    }, this);
  },

  /** 
   * Attach the specified tag to the file at the specified path.
   * Recursive helper to attachTag.
   * 
   * @param contents An array of folders and file items
   * @param path     An array of the path to traverse
   * @param tag      The tag to attach to the file at the end of the path
   */
  _attachTagToFile: function(contents, path, tag) {
    if (path.length === 1) {
      //No more folders to traverse
      //Return contents with tag added to file
      var contentsPlusFileTag = contents.map(function(item) {
        if (!item.isFolder && item.name === path[0]) {
          var newFile = Object.create(item);
          newFile.tags = Immutable.OrderedSet(newFile.tags).add(tag).toArray();
          return newFile;
        }
        return item;
      });
      return contentsPlusFileTag;
    }
    else {
      var modifiedContents = contents.map(function(item) {
        if (item.isFolder && item.name === path[0]) {
          item.contents = this._attachTagToFile(item.contents, path.slice(1), tag);
        }
        return item;
      }, this);
      return modifiedContents;
    }
  },

  /**
   * Detaches specified tag from files at specified paths.
   * 
   * @param tag   The tag to detach from all files
   * @param paths An array of file paths
   *              Each path should be an array
   */
  detachTag: function(paths, tag) {
    console.log('detach tag in database');
    paths.forEach(function(path) {
      //Modify global
      _cloud = this._detachTagFromFile(_cloud, path, tag);
    }, this);
  },

  /** 
   * Detach the specified tag from the file at the specified path.
   * Recursive helper to detachTag.
   * 
   * @param contents An array of folders and file items
   * @param path     An array of the path to traverse
   * @param tag      The tag to detach from the file at the end of the path
   */
  _detachTagFromFile: function(contents, path, tag) {
    if (path.length === 1) {
      //No more folders to traverse
      //Return contents with tag removed from file
      var contentsMinusFileTag = contents.map(function(item) {
        if (!item.isFolder && item.name === path[0]) {
          var newFile = Object.create(item);
          newFile.tags = newFile.tags.filter(function(newTag) {
            return newTag !== tag;
          });
          return newFile;
        }
        return item;
      });
      return contentsMinusFileTag;
    }
    else {
      var modifiedContents = contents.map(function(item) {
        if (item.isFolder && item.name === path[0]) {
          item.contents = this._detachTagFromFile(item.contents, path.slice(1), tag);
        }
        return item;
      }, this);
      return modifiedContents;
    }
  },

  /**
   * Returns Immutable.OrderedMap of files containing the specified tags
   *
   * @param tags Immutable.Set of tags guiding the file search
   */
  filterFiles: function(tags) {
    console.log('ask database for files');

    if (tags.isEmpty()) {
      return Immutable.OrderedMap();
    }
    
    //Keep files that contain all tags
    var allFiles = this.getFiles(_cloud);
    var files = [];
    for (var i = 0; i < allFiles.length; i++) {
      var file = allFiles[i];
      if (tags.intersect(file.tags).size === tags.size) {
        files.push(file);
      }
    }

    //Return files as a map {fileId: fileObject}
    var fileMap = {};
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      fileMap[file.id] = file;
    }

    return Immutable.OrderedMap(fileMap);
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

    console.log('hit db for tag suggestions');
    
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
    console.log('hit db for tags starting with ' + value);
    var tags = this.getTags().filter(function(tag) {
      return tag.indexOf(value) === 0;
    });
    return tags;
  },


  /**
   * Return an object of folders and files at the specified path.
   * folders is an Immutable.List of folder names
   * files is an Immutable.OrderedMap of file objects
   *
   * @param path an Immutable.List of strings representing a directory path
   */
  getContents: function(path) {
    var contents = _cloud;
    
    //Follow folders along path
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

    //Return files as Immutable.OrderedMap
    var fileMapPairs = [];
    files.forEach(function(file) {
      fileMapPairs.push([file.id, file]);
    });

    return {
      folders: folders,
      files: Immutable.OrderedMap(fileMapPairs),
    };
  }

};