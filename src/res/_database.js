//Eventually use real database logic

var Immutable = require('immutable');

var _cloud = require('./_cloud');

module.exports = {

  /**
   * Converts an array of file objects to an 
   * Immutable.OrderedMap where keys are ids 
   * and values are file objects.
   *
   * @param files An array of file objects
   */
  mapFiles: function(files) {
    var pairs = [];
    for (var i=0; i < files.length; i++) {
      var file = files[i];
      pairs.push([file.id, file]);
    }
    return Immutable.OrderedMap(pairs);
  },

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

    return this.mapFiles(files);
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

    return {
      folders: folders,
      files: this.mapFiles(files.toArray()),
    };
  },

  /**
   * At the specified path, create files from fileData objects
   * 
   * @param fileData A map of file data objects, where each entry 
   *                 of the map is structured as follows:
   * 
   *   name: {
   *     name: string,
   *     size: integer,
   *     mime: string,
   *   }
   *
   * @param path An Immutable.List of strings representing a directory path
   *
   * @return Immutable.OrderedMap of updated cloud files
   *
   * @throws "Bad path"
   */
  uploadFiles: function(fileData, path) {
    console.log("Uploading files to " + path.join("/"));

    //Point to innermost folder of path
    var contents = _cloud;
    for (var i=0; i < path.length; i++) {
      var targetFolderName = path[i];
      var foundTarget = false;
      //Search contents for folder item with the name
      for (var j=0; j < contents.length; j++) {
        var item = contents[j];
        if (item.isFolder && item.name === targetFolderName) {
          contents = item.contents;
          foundTarget = true;
          break;
        }
      }
      if (!foundTarget) {
        throw "Bad path";
      }
    }
    
    var today = new Date();
    var year = today.getFullYear();
    var month = this.months[today.getMonth()];
    var day = this.pad(today.getDate(), 2);
    
    //Update files
    for (var i=0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        //Skip folders
        continue;
      }
      if (!fileData.hasOwnProperty(item.name)) {
        //Skip files with names not in upload file data
        continue;
      }
      //Mutate file
      var file = item;
      var fileDatum = fileData[item.name];
      file.modified = [year, month, day].join(' ');
      file.size = this.abbreviate(fileDatum.size);
      file.type = this.mimeTypes[fileDatum.mime] || 'FILE';
      //Delete file data after applying each updates
      delete fileData[item.name];
    }
    
    //Create new files from remaining file data
    var newFiles = [];
    for (var name in fileData) {
      var fileDatum = fileData[name];
      file = {
        id: path.concat([fileDatum.name]).join('/'),
        name: fileDatum.name,
        path: path,
        tags: [],
        link: this.fakeFileLinks[path[0]],
        cloud: path[0],
        modified: [year, month, day].join(' '),
        size: this.abbreviate(fileDatum.size),
        type: this.mimeTypes[fileDatum.mime] || 'FILE',
      };
      newFiles.push(file);
    }
    
    //Push new files to contents
    Array.prototype.push.apply(contents, newFiles);

    var files = contents.filter(function(item) {
      return !item.isFolder;
    });

    return this.mapFiles(files);
  },

  /**
   * Convert number to an abbreviated form. The abbreviation
   * will have two decimals or none, and it will have a 
   * maximum of four combined digits and decimals.
   *
   * 1234 kB
   * 123 kB
   * 12.34 kB
   * 1.23 kB
   *
   * @param number bytes Number of bytes to abbreviate
   * @return string Abbreviated form of the specified number
   */
  abbreviate: function(bytes) {  
    var size = {
      B:  Math.pow(2,0),
      kB: Math.pow(2,10),
      MB: Math.pow(2,20),
      GB: Math.pow(2,30),
      TB: Math.pow(2,40)
    };
    
    var abbr;
    
    if (bytes < 0) { throw "File size cannot be negative"; } 
    else if (bytes < size.kB) { abbr = 'B'; }
    else if (bytes < size.MB) { abbr = 'kB'; }
    else if (bytes < size.GB) { abbr = 'MB'; }
    else if (bytes < size.TB) { abbr = 'GB'; }
    else { abbr = 'TB'; }
    
    //this string is guaranteed to have a decimal point
    var number = (bytes/size[abbr]).toFixed(2);
    
    var split = number.split('.');
    var digits = split[0];
    
    //No more than four digits and decimals combined
    //No fractional bytes
    var truncate = (digits.length === 3 || digits.length === 4) || abbr === 'B';
    var decimals = truncate ? '' : '.' + split[1];
    
    return digits + decimals + ' ' + abbr;
  },

  //Pad specified number with zeros to the specified length string
  pad: function(number, length) {
    //(length - 1) zeros
    var zeros = Array(length).join(0);
    return (zeros + number).slice(-length);
  },

  mimeTypes: {
    //Text formats
    'text/plain': 'TXT',
    'text/csv': 'CSV',
    'text/css': 'CSS',
    'text/html': 'HTML',
    
    //Application formats
    'application/pdf': 'PDF',
    'application/rtf': 'RTF',
    'application/xml': 'XML',
    'application/x-tex': 'TEX',
    'application/postscript': 'AI',
    'application/octet-stream': 'BIN',
    'application/msword': 'DOC',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    
    //Image formats
    'image/png': 'PNG',
    'image/bmp': 'BMP',
    'image/gif': 'GIF',
    'image/jpeg': 'JPG',
    'image/tiff': 'TIFF',
    'image/x-tiff': 'TIFF',
    'image/svg+xml': 'SVG',
    'image/vnd.adobe.photoshop': 'PSD',
    
    //Audio formats
    'audio/mpeg3': 'MP3',
    'audio/x-mpeg-3': 'MP3',
    'audio/wav': 'WAV',
    'audio/x-wav': 'WAV',
    'audio/x-ms-wma': 'WMA',
    'audio/midi': 'MIDI',
    'audio/x-midi': 'MIDI',
    
    //Video formats
    'video/mpeg': 'MP3',
    'video/x-mpeg': 'MP3',
    'video/x-ms-wmv': 'WMV',
    'video/mpeg': 'MPEG',
    'audio/mp4': 'MP4A',
    'video/mp4': 'MP4',
    'application/mp4': 'MP4',
    'video/x-m4v': 'M4V',
    'video/x-msvideo': 'AVI',
    'video/avi': 'AVI',
    'video/msvideo': 'AVI',
    'video/x-msvideo': 'AVI',
    'video/avs-video': 'AVI',
    'video/quicktime': 'MOV',
    'video/jpeg': 'JPGV',
  },

  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],

  //Temporary, until cloud APIs provide real links
  fakeFileLinks: {
    'Dropbox': '//www.dropbox.com/home',
    'Google Drive': '//drive.google.com',
  }

};