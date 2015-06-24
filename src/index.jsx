var React = require('react/addons');
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();
var ReactTransitionGroup = React.addons.TransitionGroup;
var Update = React.addons.update;

var Search = require('./Search');
var Cloud = require('./Cloud');
var Scratchwork = require('./Scratchwork');

var MaterialIcon = require('./MaterialIcon');
var ActionBar = require('./ActionBar');
var Snackbar = require('./Snackbar');
var Tagger = require('./Tagger');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Shadow = R.shadow;

var Util = require('./util/util');

var Page = R.constant.page;

var _Database = require('./res/_database');
var Immutable = require('immutable');


var App = React.createClass({

  //Search tags determine files
  //Files determine which files are allowed in files.open, files.selected
  getInitialState: function() {
    return {
      accounts: {
        'Dropbox': "j.doe@gmail.com",
        'Google Drive': null
      },
      page: Page.SEARCH,
      search: {
        tags: Immutable.OrderedSet(),
        value: "",
        files: {
          files: Immutable.List(),
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
        suggestions: {
          visible: true,
          tags: Immutable.OrderedSet(),
          title: ""
        }
      },
      cloud: {
        path: Immutable.List(["Tagged Clouds"]),
        folders: Immutable.List(),
        files: {
          files: Immutable.List(),
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
      },
      tagger: {
        files: Immutable.List(),
        isShowingFiles: false,
        nextPage: Page.CLOUD,
        value: "",
        suggestions: Immutable.OrderedSet()
      },
      snackbar: {
        visible: false,
        message: "",
        action: "",
        cancel: Util.noop,
        complete: Util.call,
      }
    };
  },

  _setStateFromHistory: function(event) {
    this.state.snackbar.complete();
    
    var page = event.state.page;
    var searchTags = Immutable.OrderedSet(event.state.searchTags);
    var path = Immutable.List(event.state.path);
    
    var value = "";
    var files = this.updateSearchFiles(searchTags);
    var suggestionsVisible = searchTags.isEmpty() || this.searchInputIsFocused();
    var contents = this.getContents(path);
    
    this.setState({
      page: page,
      search: Update(this.state.search, {
        tags: {$set: searchTags},
        value: {$set: value},
        files: {
          files: {$set: files.files},
          open: {$set: Immutable.Set()},
          selected: {$set: Immutable.Set()}
        }
      }),
      cloud: Update(this.state.cloud, {
        path: {$set: path},
        folders: {$set: contents.folders},
        files: {
          files: {$set: contents.files},
          open: {$set: Immutable.Set()},
          selected: {$set: Immutable.Set()}
        }
      })
    }, function() {
      this.showSearchSuggestions(suggestionsVisible);
    });
  },

  setBrowserState: function(replace) {
    //Add or replace browser history entry.
    //Specify `true` to replace browser history state 
    //instead of adding a new one.
    
    //Note: cannot store Immutable.List in history, 
    //so convert to array
    var browserState = {
      page: this.state.page,
      searchTags: this.state.search.tags.toArray(),
      path: this.state.cloud.path.toArray()
    };
    if (replace) {
      window.history.replaceState(browserState, '');
    }
    else {
      window.history.pushState(browserState, '');
    }
  },

  componentDidMount: function() {
    //Give first page a non-null state object
    window.history.replaceState({
      page: this.state.page,
      searchTags: this.state.search.tags.toArray(),
      path: this.state.cloud.path.toArray()
    }, '');

    //Listen for page changes
    window.addEventListener('popstate', this._setStateFromHistory);

    //Set initial search suggestions
    this.showSearchSuggestions(true);
  },

  componentWillUnmount: function() {
    //Stop listening for page changes
    window.removeEventListener('popstate', this._setStateFromHistory);
  },


  // SEARCH


  searchInputIsFocused: function() {
    //Return false if not in SEARCH mode

    if ('search' in this.refs) {
      //Return true if search input is focused
      var inputNode = this.refs.search.refs.searchTags.getInputNode();
      return inputNode === document.activeElement;
    }
    return false;
  },

  addSearchTag: function(tag) {
    this.state.snackbar.complete();

    //Add tag to search tags
    //Update files, based on new search tags
    //Filter files.selected and files.open, based on files
    //Clear search value
    
    //Don't add tag if it's not in suggestions
    if (!this.state.search.suggestions.tags.includes(tag)) {
      return;
    }
    
    var newSearchTags = this.state.search.tags.add(tag);
    var files = this.updateSearchFiles(newSearchTags);

    //Keep suggestions visible if input is focused
    var suggestionsVisible = this.searchInputIsFocused();
    
    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        value: {$set: ""},
        files: {
          files: {$set: files.files},
          open: {$set: files.open},
          selected: {$set: files.selected}
        }
      }),
    }, function() {
      this.showSearchSuggestions(suggestionsVisible);
      this.setBrowserState();
    });
  },

  deleteSearchTag: function(tag) {
    this.state.snackbar.complete();

    //Remove tag from search tags
    //Update files, based on new search tags
    //Filter files.selected and files.open, based on files

    var newSearchTags = this.state.search.tags.delete(tag);
    var files = this.updateSearchFiles(newSearchTags);

    //Show suggestions if there are no search tags
    var suggestionsVisible = newSearchTags.isEmpty();
    
    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        files: {
          files: {$set: files.files},
          open: {$set: files.open},
          selected: {$set: files.selected}
        }
      }),
    }, function() {
      this.showSearchSuggestions(suggestionsVisible);
      this.setBrowserState();
    });
  },

  handleSearchFocus: function() {
    this.state.snackbar.complete();
    this.showSearchSuggestions(true);
  },

  handleSearchValueChange: function(event) {
    var newValue = this.refs.search.refs.searchTags.getInputValue();
    this.setState({
      search: Update(this.state.search, {
        value: {$set: newValue}
      })
    }, function() {
      //Update search suggestions based on new search value
      this.showSearchSuggestions(true);
    });
  },

  showSearchSuggestions: function(visible) {
    //Show suggestions if visible is true
    //Hide suggestions if visible is false

    //Exception: if no search tags, force suggestions to be shown
    if (this.state.search.tags.isEmpty()) {
      visible = true;
    }

    //Update suggestions if showing them,
    //because search tags may have changed 
    //after they were last shown

    var suggestions;
    if (visible) {
      console.log('hit db for tag suggestions');
      suggestions = _Database.makeSearchSuggestion(
        this.state.search.tags, 
        this.state.search.value
      );
    } else {
      suggestions = {
        tags: this.state.search.suggestions.tags,
        title: this.state.search.suggestions.title
      };
    }

    this.setState({
      search: Update(this.state.search, {
        suggestions: {
          visible: {$set: visible},
          tags: {$set: suggestions.tags},
          title: {$set: suggestions.title}
        }
      })
    });
  },

  updateSearchFiles: function(searchTags) {
    //Returns what the next state of files, files selected, and files open
    //would look like, given the search tags

    console.log('ask database for files');

    var files = _Database.filterFiles(searchTags);
    var fileIds = files.map(function(file) {
      return file.id;
    }).toSet();
    var selected = this.state.search.files.selected.filter(
      function(fileId) {
        return fileIds.has(fileId);
      }
    );
    var open = this.state.search.files.open.filter(
      function(fileId) {
        return fileIds.has(fileId);
      }
    );
    return {
      files: files,
      selected: selected,
      open: open
    };
  },


  // FILES (Search, Cloud)

 
  /**
   * Setting nested file state is identical for search and cloud states.
   *
   * Note: Instead of using this.state.page, this method takes paramter
   * `page` specifying the page for which to set the file state, because
   * this.state.page may change before this method is called. As an example,
   * see the timeout behavior in handleFileDelete.
   *
   * @param page Must be 'search' or 'cloud'
   * @param fileUpdate An object using the React Immutability Helper syntax
   */
  setFileState: function(page, fileUpdate) {
    if (page === Page.SEARCH) {
      this.setState({
        search: Update(this.state.search, fileUpdate)
      });
    }
    else if (page === Page.CLOUD) {
      this.setState({
        cloud: Update(this.state.cloud, fileUpdate)
      });
    }
  },

  handleFileToggle: function(fileId) {
    this.state.snackbar.complete();
    
    var page = this.state.page;
    var filesOpen = this.state[page].files.open.includes(fileId) ?
                    this.state[page].files.open.delete(fileId) :
                    this.state[page].files.open.add(fileId);
    this.setFileState(page, {
      files: {
        open: {$set: filesOpen}
      }
    });
  },

  handleFileSelect: function(fileId) {
    this.state.snackbar.complete();

    var page = this.state.page;
    var filesSelected = this.state[page].files.selected.includes(fileId) ?
                        this.state[page].files.selected.delete(fileId) :
                        this.state[page].files.selected.add(fileId);
    this.setFileState(page, {
      files: {
        selected: {$set: filesSelected}
      }
    });
  },

  handleFileSelectAll: function() {
    var page = this.state.page;
    var filesSelected = this.state[page].files.files.map(function(file) {
      return file.id;
    }).toSet();

    this.setFileState(page, {
      files: {
        selected: {$set: filesSelected}
      }
    });
  },

  handleFileUnselectAll: function() {
    var page = this.state.page;
    this.setFileState(page, {
      files: {
        selected: {$set: Immutable.Set()}
      }
    });
  },

  handleFileDelete: function() {
    var page = this.state.page;

    //Files on the current page
    var pageFiles = this.state[page].files;
    
    //Files selected on the current page
    var selected = pageFiles.selected;

    //If no files selected, do nothing
    if (selected.size === 0) {
      return;
    }

    //Unlike other file-handling methods, 
    //deletion affects more than the current page
    
    //Save previous file states

    var searchFiles = this.state.search.files;
    var cloudFiles = this.state.cloud.files;

    //Optimistically set new file states on all pages
    //according to files selected current page

    //files.files - remove files with ids in files.selected
    var searchFilesFiles = searchFiles.files.filter(function(file) {
      return !selected.includes(file.id);
    });
    var cloudFilesFiles = cloudFiles.files.filter(function(file) {
      return !selected.includes(file.id);
    });

    //files.open - remove ids in files.selected
    var searchFilesOpen = searchFiles.open.filter(function(fileId) {
      return !selected.includes(fileId);
    });
    var cloudFilesOpen = cloudFiles.open.filter(function(fileId) {
      return !selected.includes(fileId);
    });

    //files.selected - remove ids in files.selected
    var searchFilesSelected = searchFiles.selected.filter(function(fileId) {
      return !selected.includes(fileId);
    });
    var cloudFilesSelected = cloudFiles.selected.filter(function(fileId) {
      return !selected.includes(fileId);
    });

    this.setState({
      search: Update(this.state.search, {
        files: {
          files: {$set: searchFilesFiles},
          open: {$set: searchFilesOpen},
          selected: {$set: searchFilesSelected}
        }
      }),
      cloud: Update(this.state.cloud, {
        files: {
          files: {$set: cloudFilesFiles},
          open: {$set: cloudFilesOpen},
          selected: {$set: cloudFilesSelected}
        }
      })
    });

    //Set snackbar state

    var numberSelected = selected.size;
    var plural = numberSelected !== 1 ? "s" : "";

    var message = "Deleted " + numberSelected + " file" + plural;

    var action = "UNDO";

    var deleteFiles = function() {
      var filesToDelete = pageFiles.files.filter(function(file) {
        return selected.includes(file.id);
      });
      var paths = filesToDelete.map(function(file) {
        return file.path.concat([file.name]);
      });
      //Delete files in database
      console.log('delete files in database');
      _Database.deleteFiles(paths);
    };

    var undoDelete = function() {
      //Ensure file state does not change between
      //the point snackbar is shown and the point
      //this method is called.

      //Reset file state
      this.setState({
        search: Update(this.state.search, {
          files: {
            files: {$set: searchFiles.files},
            open: {$set: searchFiles.open},
            selected: {$set: searchFiles.selected}
          }
        }),
        cloud: Update(this.state.cloud, {
          files: {
            files: {$set: cloudFiles.files},
            open: {$set: cloudFiles.open},
            selected: {$set: cloudFiles.selected}
          }
        })
      });
    }.bind(this);
    
    this.showSnackbar({
      message: message,
      action: action,
      cancel: undoDelete,
      complete: deleteFiles,
    });
  },


  // CLOUD


  handlePathShorten: function(index) {
    this.state.snackbar.complete();
    
    var path = this.state.cloud.path.slice(0, index + 1);
    var contents = this.getContents(path);
    var folders = contents.folders;
    var files = contents.files;
    this.setState({
      cloud: Update(this.state.cloud, {
        path: {$set: path},
        folders: {$set: folders},
        files: {
          files: {$set: files},
          selected: {$set: Immutable.Set()},
          open: {$set: Immutable.Set()}
        }
      })
    }, this.setBrowserState);
  },

  handlePathLengthen: function(folder) {
    this.state.snackbar.complete();
    
    var path = this.state.cloud.path.push(folder);
    var contents = this.getContents(path);
    var folders = contents.folders;
    var files = contents.files;
    this.setState({
      cloud: Update(this.state.cloud, {
        path: {$set: path},
        folders: {$set: folders},
        files: {
          files: {$set: files},
          selected: {$set: Immutable.Set()},
          open: {$set: Immutable.Set()}
        }
      })
    }, this.setBrowserState);
  },

  getContents: function(path) {
    //Use all but first item of path
    return _Database.getContents(path.rest());
  },


  // TAGGER


  openTagger: function() {
    //Set Tagger files to selected files on current page, 
    //then navigate to Tagger page.
    var page = this.state.page;
    var files = this.state[page].files.files.filter(function(file) {
      return this.state[page].files.selected.includes(file.id);
    }, this);
    this.setState({
      tagger: Update(this.state.tagger, {
        files: {$set: files},
        nextPage: {$set: page}
      })
    }, this.navigate.bind(this, Page.TAGGER));
  },

  handleTaggerToggle: function() {
    this.setState({
      tagger: Update(this.state.tagger, {
        isShowingFiles: {$set: !this.state.tagger.isShowingFiles}
      })
    });
  },

  closeTagger: function() {
    //Collapse header and clear value when closing Tagger
    this.setState({
      tagger: Update(this.state.tagger, {
        isShowingFiles: {$set: false},
        value: {$set: ""}
      })
    });
    this.navigate(this.state.tagger.nextPage);
  },

  handleTaggerFocus: function() {
    this.state.snackbar.complete();
  },

  handleTaggerValueChange: function(event) {
    var newValue = this.refs.tagger.refs.tagsOnAllFiles.getInputValue();
    var suggestions = _Database.makeTaggerSuggestion(newValue);
    this.setState({
      tagger: Update(this.state.tagger, {
        value: {$set: newValue},
        suggestions: {$set: suggestions}
      })
    });
  },

  handleTagAttach: function(tag) {

    var _handleTagAttach = function() {

      //Optimistically update tagger file state

      //Save previous tagger file state
      var taggerFiles = this.state.tagger.files;
      
      //Add tag to tagger files
      var newTaggerFiles = taggerFiles.map(function(file) {
        var newFile = Immutable.Map(file).toObject();
        newFile.tags = Immutable.OrderedSet(newFile.tags).add(tag).toArray();
        return newFile;
      });

      //Optimistically update search file state
      
      //Get ids of tagger files
      var page = this.state.tagger.nextPage;
      var taggerFileIds = this.state[page].files.selected;
      
      //Save previous search file state
      var searchFiles = this.state.search.files;
      
      var searchTags = this.state.search.tags;

      //Add tag to search files that are also tagger files
      var newSearchFiles = searchFiles.files.map(function(file) {
        if (taggerFileIds.includes(file.id)) {
          var newFile = Immutable.Map(file).toObject();
          newFile.tags = Immutable.OrderedSet(newFile.tags).add(tag).toArray();
          return newFile;
        }
        else {
          return file;
        }
      });
      //Add tagger files to search files if tag is in search tags
      if (searchTags.includes(tag)) {
        newTaggerFiles.forEach(function(file) {
          //Only tagger files not already in search files
          var fileAlreadyInSearchFiles = newSearchFiles.some(function(f) {
            return f.id === file.id;
          });
          if (!fileAlreadyInSearchFiles) {
            newSearchFiles = newSearchFiles.push(file);
          }
        });
      }
      
      //Optimistically update cloud file state
      
      //Save previous cloud file state
      var cloudFiles = this.state.cloud.files;
      
      //Add tag to cloud files that are also tagger files
      var newCloudFiles = cloudFiles.files.map(function(file) {
        if (taggerFileIds.includes(file.id)) {
          var newFile = Immutable.Map(file).toObject();
          newFile.tags = Immutable.OrderedSet(newFile.tags).add(tag).toArray();
          return newFile;
        }
        else {
          return file;
        }
      });
      
      this.setState({
        tagger: Update(this.state.tagger, {
          files: {$set: newTaggerFiles},
          value: {$set: ""}
        }),
        search: Update(this.state.search, {
          files: {
            files: {$set: newSearchFiles},
          }
        }),
        cloud: Update(this.state.cloud, {
          files: {
            files: {$set: newCloudFiles}
          }
        })
      });

      //Set snackbar state
      
      //Count the number of tagger files that had the tag 
      //before it was attached to all tagger files
      var beforeCount = taggerFiles.count(function(file) {
        return Immutable.Set(file.tags).includes(tag);
      });
      
      var fileCount = newTaggerFiles.size - beforeCount;

      var message = "Added " + '"' + tag + '"' + " to " + fileCount + " file" + (fileCount === 1 ? "" : "s");

      var action = "UNDO";

      var attachTag = function() {
        var paths = taggerFiles.map(function(file) {
          return file.path.concat([file.name]);
        });
        //Attach tag in database
        console.log('attach tag in database');
        _Database.attachTag(paths, tag);
      };

      var undoAttach = function() {
        //Ensure file state does not change between
        //the point snackbar is shown and the point
        //this method is called.

        //Reset file state
        this.setState({
          tagger: Update(this.state.tagger, {
            files: {$set: taggerFiles}
          }),
          search: Update(this.state.search, {
            files: {
              files: {$set: searchFiles.files},
            }
          }),
          cloud: Update(this.state.cloud, {
            files: {
              files: {$set: cloudFiles.files}
            }
          })
        });
      }.bind(this);

      this.showSnackbar({
        message: message,
        action: action,
        cancel: undoAttach,
        complete: attachTag,
      });
    
    }.bind(this);

    this.state.snackbar.complete(_handleTagAttach);

  },

  /**
   * Return a copy of the specified file object 
   * without the specified tag.
   *
   * @param tag  The tag to detach
   * @param file The file from which to detach the tag
   */
  detachTagFromFile: function(tag, file) {
    var newFile = Object.create(file);
    newFile.tags = newFile.tags.filter(function(newTag) {
      return newTag !== tag;
    });
    return newFile;
  },

  handleTagDetach: function(tag) {
    
    var _handleTagDetach = function() {

      //Optimistically update tagger file state

      //Save previous tagger file state
      var taggerFiles = this.state.tagger.files;
      
      //Remove tag from tagger files
      var newTaggerFiles = taggerFiles.map(function(file) {
        return this.detachTagFromFile(tag, file);
      }, this);

      //Optimistically update search file state
      
      //Get ids of tagger files
      var page = this.state.tagger.nextPage;
      var taggerFileIds = this.state[page].files.selected;
      
      //Save previous search file state
      var searchFiles = this.state.search.files;
      
      var searchTags = this.state.search.tags;

      //Remove tag from search files that are also tagger files
      var newSearchFiles = searchFiles.files.map(function(file) {
        if (taggerFileIds.includes(file.id)) {
          return this.detachTagFromFile(tag, file);
        }
        else {
          return file;
        }
      }, this)
      //Remove search files that no longer match all search tags
      .filter(function(file) {
        return searchTags.intersect(file.tags).size === searchTags.size;
      });
      
      //Remove files ids no longer in search files
      var searchFilesOpen = searchFiles.open.filter(function(fileId) {
        return newSearchFiles.some(function(file) {
          return file.id === fileId;
        });
      });
      
      //Remove file ids no longer in search files
      var searchFilesSelected = searchFiles.selected.filter(function(fileId) {
        return newSearchFiles.some(function(file) {
          return file.id === fileId;
        });
      });
      
      //Optimistically update cloud file state
      
      //Save previous cloud file state
      var cloudFiles = this.state.cloud.files;
      
      //Remove tag from cloud files that are also tagger files
      var newCloudFiles = cloudFiles.files.map(function(file) {
        if (taggerFileIds.includes(file.id)) {
          return this.detachTagFromFile(tag, file);
        }
        else {
          return file;
        }
      }, this);
      
      this.setState({
        tagger: Update(this.state.tagger, {
          files: {$set: newTaggerFiles}
        }),
        search: Update(this.state.search, {
          files: {
            files: {$set: newSearchFiles},
            open: {$set: searchFilesOpen},
            selected: {$set: searchFilesSelected}
          }
        }),
        cloud: Update(this.state.cloud, {
          files: {
            files: {$set: newCloudFiles}
          }
        })
      });

      //Set snackbar state

      var fileCount = this.state.tagger.files.size;

      var message = "Removed " + '"' + tag + '"' + " from " + fileCount + " file" + (fileCount === 1 ? "" : "s");

      var action = "UNDO";

      var detachTag = function() {
        var paths = taggerFiles.map(function(file) {
          return file.path.concat([file.name]);
        });
        //Detach tags in database
        console.log('detach tag in database');
        _Database.detachTag(paths, tag);
      };

      var undoDetach = function() {
        //Ensure file state does not change between
        //the point snackbar is shown and the point
        //this method is called.

        //Reset file state
        this.setState({
          tagger: Update(this.state.tagger, {
            files: {$set: taggerFiles}
          }),
          search: Update(this.state.search, {
            files: {
              files: {$set: searchFiles.files},
              open: {$set: searchFiles.open},
              selected: {$set: searchFiles.selected}
            }
          }),
          cloud: Update(this.state.cloud, {
            files: {
              files: {$set: cloudFiles.files}
            }
          })
        });
      }.bind(this);

      this.showSnackbar({
        message: message,
        action: action,
        cancel: undoDetach,
        complete: detachTag,
      });
    
    }.bind(this);

    this.state.snackbar.complete(_handleTagDetach);

  },


  // SNACKBAR


  showSnackbar: function(snackbarState) {
    //After delay, hide snackbar and call snackbarComplete
    var snackbarDelay = 6000;
    var snackbarTimeoutId = window.setTimeout(function() {
      snackbarComplete();
    }, snackbarDelay);
    var snackbarCancel = function() {
      window.clearTimeout(snackbarTimeoutId);
      snackbarState.cancel();
      this.setState({
        snackbar: Update(this.state.snackbar, {
          visible: {$set: false},
          cancel: {$set: Util.noop},
          complete: {$set: Util.call}
        })
      });
    }.bind(this);
    var snackbarComplete = function(callback) {
      window.clearTimeout(snackbarTimeoutId);
      snackbarState.complete();
      this.setState({
        snackbar: Update(this.state.snackbar, {
          visible: {$set: false},
          cancel: {$set: Util.noop},
          complete: {$set: Util.call}
        })
      }, callback);
    }.bind(this);
    this.setState({
      snackbar: Update(this.state.snackbar, {
        visible: {$set: true},
        message: {$set: snackbarState.message},
        action: {$set: snackbarState.action},
        cancel: {$set: snackbarCancel},
        complete: {$set: snackbarComplete}
      })
    });
  },


  // App pages


  getSearchProps: function() {
    return {
      searchTags: this.state.search.tags,
      searchValue: this.state.search.value,
      
      files: this.state.search.files.files,
      filesSelected: this.state.search.files.selected,
      filesOpen: this.state.search.files.open,

      suggestionsVisible: this.state.search.suggestions.visible,
      suggestionsTags: this.state.search.suggestions.tags,
      suggestionsTitle: this.state.search.suggestions.title,
      
      onSearchTagAdd: this.addSearchTag,
      onSearchTagDelete: this.deleteSearchTag,

      onSearchFocus: this.handleSearchFocus,
      onSearchValueChange: this.handleSearchValueChange,
      
      onFileToggle: this.handleFileToggle,
      onFileSelect: this.handleFileSelect,
      onFileSelectAll: this.handleFileSelectAll,
      onFileUnselectAll: this.handleFileUnselectAll,
      onFileDelete: this.handleFileDelete,
      onFileTag: this.openTagger,
    };
  },

  getCloudProps: function() {
    return {
      accounts: this.state.accounts,
      path: this.state.cloud.path,
      folders: this.state.cloud.folders,
      
      files: this.state.cloud.files.files,
      filesSelected: this.state.cloud.files.selected,
      filesOpen: this.state.cloud.files.open,
      
      onPathShorten: this.handlePathShorten,
      onPathLengthen: this.handlePathLengthen,

      onFileToggle: this.handleFileToggle,
      onFileSelect: this.handleFileSelect,
      onFileSelectAll: this.handleFileSelectAll,
      onFileUnselectAll: this.handleFileUnselectAll,
      onFileDelete: this.handleFileDelete,
      onFileTag: this.openTagger,
    };
  },

  getTaggerProps: function() {
    return {
      files: this.state.tagger.files,
      isShowingFiles: this.state.tagger.isShowingFiles,
      onToggle: this.handleTaggerToggle,
      onClose: this.closeTagger,

      taggerValue: this.state.tagger.value,
      onTaggerValueChange: this.handleTaggerValueChange,
      suggestions: this.state.tagger.suggestions,
      onTaggerFocus: this.handleTaggerFocus,

      onTagAttach: this.handleTagAttach,
      onTagDetach: this.handleTagDetach,
    };
  },
  
  getPage: function() {
    var page;
    switch(this.state.page) {
      case Page.SEARCH:
        page = <Search ref="search" {...this.getSearchProps()}/>;
        break;
      case Page.CLOUD:
        page = <Cloud {...this.getCloudProps()}/>;
        break;
      case Page.TAGGER:
        page = <Tagger ref="tagger" {...this.getTaggerProps()}/>;
        break;
      case Page.SCRATCH:
        page = <Scratchwork/>;
        break;
      default:
        //Invariant: this.state.page should always be defined
        throw "NOT A VALID PAGE";
    }
    return page;
  },

  navigate: function(page) {
    var currentPage = this.state.page;
    if (page === currentPage) {
      return;
    }
    this.state.snackbar.complete();
    this.setState({
      page: page
    }, function() {
      var replace = currentPage === Page.TAGGER;
      this.setBrowserState(replace);
    });
  },

  getStyle: function() {
    return {
      app: {
        color: Color.blackPrimary,
        fontFamily: 'Roboto, sans-serif',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        paddingBottom: Dimension.heightAppBarMobile,
        height: '100%'
      },
      appBar: {
        actionBar: {
          backgroundColor: Color.blue500,
          boxShadow: Shadow.zDepth[this.props.zDepth],
          padding: Dimension.quantum,
        }
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    var page = this.getPage();

    var iconProps = {
      scratchwork: {
        d: Icon.trash,
        fill: this.state.page === Page.SCRATCH ? Color.white : Color.black,
        fillOpacity: this.state.page === Page.SCRATCH ? Color.whitePrimaryOpacity : Color.blackSecondaryOpacity,
        onClick: this.navigate.bind(this, Page.SCRATCH)
      },
      search: {
        d: Icon.search,
        fill: this.state.page === Page.SEARCH ? Color.white : Color.black,
        fillOpacity: this.state.page === Page.SEARCH ? Color.whitePrimaryOpacity : Color.blackSecondaryOpacity,
        onClick: this.navigate.bind(this, Page.SEARCH)
      },
      cloud: {
        d: Icon.cloud,
        fill: this.state.page === Page.CLOUD ? Color.white : Color.black,
        fillOpacity: this.state.page === Page.CLOUD ? Color.whitePrimaryOpacity : Color.blackSecondaryOpacity,
        onClick: this.navigate.bind(this, Page.CLOUD)
      }
    };

    var appBar = null;
    if (this.state.page === Page.SEARCH || this.state.page === Page.CLOUD) {
      appBar = (
        <ActionBar style={style.appBar}>
            <MaterialIcon action="Scratch" {...iconProps.scratchwork}/>
            <MaterialIcon action="Search" {...iconProps.search}/>
            <MaterialIcon action="Cloud" {...iconProps.cloud}/>
        </ActionBar>
      );
    }

    var snackbar = null;
    if(this.state.snackbar.visible) {
      snackbar = (
        <Snackbar message={this.state.snackbar.message}
                  action={this.state.snackbar.action}
                  onCancel={this.state.snackbar.cancel}/>
      );
    }

    return (
      <div style={style.app} onMouseDown={this.showSearchSuggestions.bind(this, false)}>
          {appBar}
          {page}
          <ReactTransitionGroup>
              {snackbar}
          </ReactTransitionGroup>
      </div>
    );
  }

});

React.render(<App/>, document.getElementById('content'));