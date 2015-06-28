//Eventually use real database logic

var Immutable = require('immutable');
var RSVP = require('rsvp');
var _cloud = require('./_cloud');

var databaseLatency = 1500;

module.exports = {
  
  
  // READ

  
  /**
   * Returns an array which includes all files directly inside 
   * the specified contents and all files nested in folders.
   * 
   * @param contents An array of file and folder objects
   */
  getAllFiles: function(contents) {
    var files = [];
    for (var i = 0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        Array.prototype.push.apply(files, this.getAllFiles(item.contents));
      }
      else {
        files.push(item);
      }
    }
    return files;
  },
  
  
  /**
   * Returns Immutable.OrderedMap of files containing the specified tags
   *
   * @param tags Immutable.Set of tags guiding the file search
   */
  filterFiles: function(tags) {
    console.log('ask database for files');
    
    var files = [];
    
    if (!tags.isEmpty()) {
      //Keep files that contain all tags
      var allFiles = this.getAllFiles(_cloud);
      for (var i = 0; i < allFiles.length; i++) {
        var file = allFiles[i];
        if (tags.intersect(file.tags).size === tags.size) {
          files.push(file);
        }
      }
    }
    
    return this.delayResponse(this.mapFiles(files));
  },

  
  /**
   * Returns Immutable.OrderedSet of tags from all files. If value 
   * is defined, returns only tags that start with value.
   * 
   * @param value If provided, a string with which all tags should start
   */
  getTags: function(value) {
    var tags = [];
    var allFiles = this.getAllFiles(_cloud);
    for (var i = 0; i < allFiles.length; i++) {
      var file = allFiles[i];
      Array.prototype.push.apply(tags, file.tags);
    }
    
    var tagSet = Immutable.Set(tags).sort();
    
    //Filter tags that start with value
    if (value !== undefined) {
      console.log('ask db for tags starting with ' + value);
      tagSet = tagSet.filter(function(tag) {
        return tag.indexOf(value) === 0;
      });
    }
    else {
      console.log('ask db for all tags');
    }

    return this.delayResponse(tagSet);
  },


  /**
   * Returns Immutable.OrderedSet of tag suggestions based on 
   * specified search tags and search value
   * 
   * @param searchValue string with which all returned tags should start
   * @param searchTags  Immutable.Set of tags with which all returned tags should share a file
   */
  suggestSearchTags: function(searchTags, searchValue) {

    var suggestedTags;

    if (searchTags.isEmpty()) {
      return this.getTags(searchValue);
    } else {
      //Tags on files that contain all search tags AND start with search value
      //(empty string starts every string)

      console.log('ask db for search tag suggestions');
    
      var suggestions = [];
      var allFiles = this.getAllFiles(_cloud);
      for (var i = 0; i < allFiles.length; i++) {
        var file = allFiles[i];
        if (searchTags.intersect(file.tags).size === searchTags.size) { 
          //Keep only file tags that start with search value
          var matchingTags = [];
          for (var j = 0; j < file.tags.length; j++) {
            var tag = file.tags[j];
            if (tag.indexOf(searchValue) === 0) {
              matchingTags.push(tag);
            }
          }
          //Add matching file tags to suggested tags
          Array.prototype.push.apply(suggestions, matchingTags);
        }
      }
      //Exclude existing search tags (we're refining)
      suggestedTags = Immutable.Set(suggestions).subtract(searchTags).sort();

      return this.delayResponse(suggestedTags);
    }
  },
  

  /**
   * Return contents at the specified path.
   *
   * @param path An array of strings representing a directory path
   * 
   * @return An object of folders and files, where:
   *   folders: Immutable.List of folder names
   *   files: Immutable.OrderedMap of file objects
   */
  getContents: function(path) {
    var contents = this.goToFolder(path);

    var folders = [];
    var files = [];
    for (var i=0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        //folder names only
        folders.push(item.name);
      } 
      else {
        files.push(item);
      }
    }
    
    return {
      folders: Immutable.List(folders),
      files: this.mapFiles(files),
    };
  },

  
  /**
   * Return Immutable.List of folder names at the specified path.
   *
   * @param path An array of strings representing a directory path
   */
  getFolders: function(path) {
    var contents = this.goToFolder(path);

    var folders = [];
    for (var i=0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        folders.push(item.name);
      } 
    }
    return Immutable.List(folders);
  },

  
  /**
   * Return Immutable.OrderedMap of files at the specified path.
   *
   * @param path An array of strings representing a directory path
   */
  getFiles: function(path) {
    var contents = this.goToFolder(path);

    var files = [];
    for (var i=0; i < contents.length; i++) {
      var item = contents[i];
      if (!item.isFolder) {
        files.push(item);
      }
    }

    return this.mapFiles(files);
  },


  // WRITE
  
  
  /**
   * Deletes files matching the specified paths.
   * 
   * @param paths An array of file paths to be deleted
   *              Each path should be an array
   */
  deleteFiles: function(paths) {
    console.log('delete files in database');
    this.forEachPath(paths, function(file, index, contents) {
      //Delete file from contents
      contents.splice(index, 1);
    });
  },


  /**
   * Attaches specified tag to files at specified paths.
   * 
   * @param tag   The tag to attach to all files
   * @param paths An array of file paths
   *              Each path should be an array
   */
  attachTag: function(paths, tag) {
    console.log('attach tag in database');
    this.forEachPath(paths, function(file) {
      //Attach tag to file
      file.tags.push(tag);
    });
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
    this.forEachPath(paths, function(file) {
      //Remove tag from file
      var tags = file.tags;

      //Find index of tag
      var index;
      for (var j = 0; j < tags.length; j++) {
        if (tags[j] === tag) {
          index = j;
          break;
        }
      }

      tags.splice(index, 1);
    });
  },


  /**
   * Go to the specified path, and update and create files 
   * based on the specified fileData objects.
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
   * @param path An array of strings representing a directory path
   *
   * @return Immutable.OrderedMap of the files at the path after upload
   */
  uploadFiles: function(fileData, path) {
    console.log("Uploading files to " + path.join("/"));

    var contents = this.goToFolder(path);
    
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


  // OTHER


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
      //Use full file path as id
      var id = file.path.concat(file.name).join('/');
      pairs.push([id, file]);
    }
    return Immutable.OrderedMap(pairs);
  },
    

  /**
   * Returns a reference to the contents array for the folder at
   * the specified path.
   *
   * @param path An array of strings representing a folder path
   * 
   * @return An array reference to a folders contents
   *
   * @throws "Bad path"
   */
  goToFolder: function(path) {
    //Point to the contents of folder at path
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
    return contents;
  },
  
  
  /**
   * Calls the callback for each path specified
   * 
   * @param paths An array of file paths. Each path should be an array
   * @param callback A function to be called for each path
   *
   * @throws "File not found"
   */
  forEachPath: function(paths, callback) {
    for (var i = 0 ; i < paths.length; i++) {
      //Take as path all but file name
      var path = paths[i];
      var basename = path.slice(0,-1);
      var filename = path[path.length - 1];
      var contents = this.goToFolder(basename);
      //Find index of file with filename
      var index;
      var file;
      for (var j = 0; j < contents.length; j++) {
        var item = contents[j];
        if (!item.isFolder && item.name === filename) {
          index = j;
          file = item;
          break;
        }
      }
      if (index === undefined) {
        throw "File not found";
      }
      //Call callback
      callback(file, index, contents);
    }
  },

  
  //Returns a Promise that resolves after a delay
  //Use this to simulate a delayed database response
  delayResponse: function(response) {
    return new RSVP.Promise(function(resolve, reject) {
      window.setTimeout(function() {
        resolve(response);
      }, databaseLatency);
    });
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