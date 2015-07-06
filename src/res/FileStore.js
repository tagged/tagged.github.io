var Immutable = require('immutable');

var _files = [
  {
    isFolder: true,
    path: ['Dropbox'],
    contents: [
      {
        isFolder: false,
        path: ['Dropbox', 'Getting Started.pdf'],
        modified: '2010 Sep 16',
        size: '124 kB',
        type: 'PDF',
        link: '//www.dropbox.com/home',
        tags: [],
      },
      {
        isFolder: true,
        path: ['Dropbox','Public'],
        contents: [
          {
            isFolder: false,
            path: ['Dropbox','Public','How to use the public folder.rtf'],
            modified: '2010 Sep 16',
            size: '1.05 kB',
            type: 'RTF',
            link: '//www.dropbox.com/home',
            tags: [],
          }
        ]
      },
      {
        isFolder: true,
        path: ['Dropbox','Samples'],
        contents: [
          {
            isFolder: true,
            path: ['Dropbox','Samples','Photos'],
            contents: [
              {
                isFolder: false,
                path: ['Dropbox','Samples','Photos','hawaii-1.jpg'],
                modified: '2013 Mar 12',
                size: '4.92 MB',
                type: 'JPG',
                link: '//www.dropbox.com/home',
                tags: ['Hawaii','vacation','photo'],
              },
              {
                isFolder: false,
                path: ['Dropbox','Samples','Photos','hawaii-2.jpg'],
                modified: '2013 Mar 12',
                size: '3.78 MB',
                type: 'JPG',
                link: '//www.dropbox.com/home',
                tags: ['Hawaii','vacation','photo','beach'],
              },
              {
                isFolder: false,
                path: ['Dropbox','Samples','Photos','hawaii-3.jpg'],
                modified: '2013 Mar 13',
                size: '5.21 MB',
                type: 'JPG',
                link: '//www.dropbox.com/home',
                tags: ['Hawaii','vacation','photo','luau'],
              }
            ]
          },
          {
            isFolder: true,
            path: ['Dropbox','Samples','Recipes'],
            contents: [
              {
                isFolder: false,
                path: ['Dropbox','Samples','Recipes','spicy pork bulgogi'],
                modified: '2014 Aug 12',
                size: '255 B',
                type: 'FILE',
                link: '//www.dropbox.com/home',
                tags: ['pork','spicy','recipe'],
              },
              {
                isFolder: false,
                path: ['Dropbox','Samples','Recipes','banana cheesecake'],
                modified: '2013 May 20',
                size: '749 B',
                type: 'FILE',
                link: '//dropbox.com/home',
                tags: ['recipe','banana','dessert','cheesecake']
              },
              {
                isFolder: false,
                path: ['Dropbox','Samples','Recipes','char siu'],
                modified: '2015 Feb 28',
                size: '25 kB',
                type: 'PDF',
                link: '//www.dropbox.com/home',
                tags: ['pork','honey','five spice','recipe'],
              },
            ]
          }
        ]
      }
    ]
  },
  {
    isFolder: true,
    path: ['Google Drive'],
    contents: [
      {
        isFolder: false,
        path: ['Google Drive','pork ribs'],
        modified: '2014 Aug 12',
        size: '184 B',
        type: 'FILE',
        link: '//drive.google.com',
        tags: ['pork','honey','vinegar','ribs','recipe'],
      },
      {
        isFolder: false,
        path: ['Google Drive','lab5.xlsx'],
        modified: '2011 Oct 6',
        size: '15.01 kB',
        type: 'XLSX',
        link: '//drive.google.com',
        tags: ['school','assignment']
      },
      {
        isFolder: false,
        path: ['Google Drive','HW-3'],
        modified: '2010 Jan 17',
        size: '290 kB',
        type: 'FILE',
        link: '//drive.google.com',
        tags: ['school','homework','assignment']
      },
      {
        isFolder: false,
        path: ['Google Drive','apartment-list.xls'],
        modified: '2009 Aug 18',
        size: '20.93 kB',
        type: 'XLS',
        link: '//drive.google.com',
        tags: ['school','housing']
      },
      {
        isFolder: false,
        path: ['Google Drive','Banana ice cream'],
        modified: '2013 Apr 2',
        size: '551 B',
        type: 'TXT',
        link: '//drive.google.com',
        tags: ['recipe','ice cream','dessert','banana']
      },
      {
        isFolder: true,
        path: ['Google Drive','Other'],
        contents: [
          {
            isFolder: false,
            path: ['Google Drive', 'Other','come-fly-with-me.mp3'],
            modified: '2011 May 11',
            size: '4.19 MB',
            type: 'MP3',
            link: '//drive.google.com',
            tags: ['music']
          }
        ]
      }
    ]
  }
];


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
var _abbreviate = function(bytes) {  
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
};


/**
 * Pad the given number with zeros to the specified string length
 *
 * @param number {number}
 * @param length {number}
 *
 * @return {string}
 */
var _pad = function(number, length) {
  //(length - 1) zeros
  var zeros = Array(length).join(0);
  return (zeros + number).slice(-length);
};


var _mimeTypes = {
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
};


var _months = [
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
];


//Temporary, until cloud APIs provide real links
var _fakeFileLinks = {
  'Dropbox': '//www.dropbox.com/home',
  'Google Drive': '//drive.google.com',
};





// FILE STORE


var FileStore = {

  
  // READ METHODS
  

  /**
   * Get all files and folders as a nested structure.
   * @return {array}
   */
  getAll: function() {
    return _files;
  },


  // WRITE METHODS


  /**
   * Deletes files matching the specified paths.
   * 
   * @param paths {string[]} file paths to be deleted
   */
  deleteFiles: function(paths) {
    console.log('delete files in filestore');
    this.forEachPath(paths, function(file, index, contents) {
      //Delete file from contents
      contents.splice(index, 1);
    });
  },


  /**
   * Attach specified tag to files at specified paths.
   * 
   * @param tag {string} tag to attach to all files
   * @param paths {string[]} file paths
   */
  attachTag: function(paths, tag) {
    console.log('attach tag in filestore');
    this.forEachPath(paths, function(file) {
      //Attach tag to file (prevent duplicate tags)
      file.tags = Immutable.Set(file.tags).add(tag).toArray();
    });
  },


  /**
   * Detach specified tag from files at specified paths.
   * 
   * @param tag {string} tag to detach from all files
   * @param paths {string[]} file paths
   */
  detachTag: function(paths, tag) {
    console.log('detach tag in filestore');
    this.forEachPath(paths, function(file) {
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
   * Detach tags from files at specified paths.
   * 
   * @param tags {string[]} tags to detach from all files
   * @param paths {string[]} file paths
   */
  detachTags: function(paths, tags) {
    console.log('detach tags in filestore');
    this.forEachPath(paths, function(file) {
      file.tags = Immutable.Set(file.tags).subtract(tags).toArray();
    });
  },


  /**
   * Calls the callback for each file path specified
   * 
   * @param paths {string[]} file paths
   * @param callback {(file {object}, index {number}, contents{array}) => any}
   *        called for each file path
   *
   * @throws "File not found"
   */
  forEachPath: function(paths, callback) {
    
    for (var i = 0 ; i < paths.length; i++) {
      
      //Take as path all but file name
      var path = paths[i].split('/');
      var basename = path.slice(0,-1);
      var filename = path[path.length - 1];
      
      var contents = this.goToFolder(_files, basename);
      
      //Find index of file with filename
      var index;
      var file;
      for (var j = 0; j < contents.length; j++) {
        var item = contents[j];
        if (!item.isFolder && item.path[item.path.length-1] === filename) {
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


  /**
   * Create or update all files in fileData at the specified path
   * 
   * @param fileData A map of file data objects, where each entry 
   *                 of the map is structured as follows:
   *   name: {
   *     name: string,
   *     size: integer,
   *     mime: string,
   *   }
   *
   * @param path {array} folder path
   */
  uploadFiles: function(fileData, path) {
    console.log("Uploading files to " + path.join("/"));

    var contents = this.goToFolder(_files, path);
    
    var today = new Date();
    var year = today.getFullYear();
    var month = _months[today.getMonth()];
    var day = _pad(today.getDate(), 2);
    
    //Update files
    for (var i=0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        //Skip folders
        continue;
      }
      if (!fileData.hasOwnProperty(item.path[item.path.length - 1])) {
        //Skip files with names not in upload file data
        continue;
      }
      //Update file in place
      var file = item;
      var fileDatum = fileData[item.path[item.path.length - 1]];
      file.modified = [year, month, day].join(' ');
      file.size = _abbreviate(fileDatum.size);
      file.type = _mimeTypes[fileDatum.mime] || 'FILE';
      //Delete file data after applying each updates
      delete fileData[item.path[item.path.length - 1]];
    }
    
    //Create new files from remaining file data
    var newFiles = [];
    for (var name in fileData) {
      var fileDatum = fileData[name];
      file = {
        path: path.concat(fileDatum.name),
        tags: [],
        link: _fakeFileLinks[path[0]],
        modified: [year, month, day].join(' '),
        size: _abbreviate(fileDatum.size),
        type: _mimeTypes[fileDatum.mime] || 'FILE',
      };
      newFiles.push(file);
    }
    Array.prototype.push.apply(contents, newFiles);
  },



  // FUNCTIONAL METHODS


  /**
   * Return all files nested in contents as a flattened array.
   * 
   * @param contents An array of file and folder objects
   */
  getFiles: function(contents) {
    var files = [];
    for (var i = 0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        Array.prototype.push.apply(files, this.getFiles(item.contents));
      }
      else {
        files.push(item);
      }
    }
    return files;
  },


  /**
   * Get tags from files.
   *
   * @param {array} file objects from which to get tags
   * @return {Immutable.Set}
   */
  getTags: function(files) {
    var tags = [];
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      Array.prototype.push.apply(tags, file.tags);
    }
    return Immutable.Set(tags);
  },


  getTagsStartingWith: function(files, value) {
    var tagArray = [];
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      for (var j = 0; j < file.tags.length; j++) {
        var tag = file.tags[j];
        if (tag.indexOf(value) === 0) {
          tagArray.push(tag);
        }
      }
    }
    return Immutable.Set(tagArray);
  },


  /**
   * Returns a new array of files that have all the specified tags
   *
   * @param tags Immutable.Set of tags guiding the file search
   */
  filterFiles: function(files, tags) {
    var filteredFiles = [];
    if (!tags.isEmpty()) {
      //Keep files that contain all tags
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (tags.isSubset(file.tags)) {
          filteredFiles.push(file);
        }
      }
    }
    return filteredFiles;
  },

  
  /**
   * Get file at the given path, if the file exists.
   *
   * @param path {array} file path
   * 
   * @return {object} file at the specified path, if the file exists
   */
  getFile: function(contents, path) {
    var basename = path.slice(0,-1);
    var filename = path[path.length - 1];
    contents = this.goToFolder(contents, basename);
    for (var i = 0; i < contents.length; i++) {
      var item = contents[i];
      if (!item.isFolder) {
        var name = item.path[item.path.length - 1];
        if (name === filename) {
          return item;
        }
      }
    }
  },


  /**
   * Splits contents of given folder into files and folders.
   *
   * @param path {array} folder path
   * 
   * @return {object} with the following properties:
   *   folders {array} folder names
   *   files: {array} file objects
   */
  getContents: function(contents, path) {
    contents = this.goToFolder(contents, path);
    var folders = [];
    var files = [];
    for (var i = 0; i < contents.length; i++) {
      var item = contents[i];
      if (item.isFolder) {
        //folder names only
        folders.push(item.path[item.path.length - 1]);
      } 
      else {
        files.push(item);
      }
    }
    return {
      folders: folders,
      files: files,
    };
  },


  /**
   * Returns a reference to the folder at the given path 
   * in the given array of nested content
   *
   * @param path {array} a folder path
   * 
   * @return {array} reference to a folder's contents
   *
   * @throws "Bad path"
   */
  goToFolder: function(contents, path) {
    //Point to the contents of folder at path
    for (var i = 0; i < path.length; i++) {
      var targetFolderName = path[i];
      var foundTarget = false;
      //Search contents for folder item with the name
      for (var j=0; j < contents.length; j++) {
        var item = contents[j];
        if (item.isFolder && item.path[item.path.length -1] === targetFolderName) {
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
  

};

module.exports = FileStore;
