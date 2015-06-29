var React = require('react/addons');
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();
var ReactTransitionGroup = React.addons.TransitionGroup;
var Update = React.addons.update;

var Search = require('./Search');
var Cloud = require('./Cloud');
var Tagger = require('./Tagger');
var Snackbar = require('./Snackbar');

var MaterialIcon = require('./MaterialIcon');
var ActionBar = require('./ActionBar');
var Logo = require('./Logo');

var R = require('./res/index');
var Animation = R.animation;
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Shadow = R.shadow;
var Typography = R.typography;
var Value = R.value;

var Util = require('./util/util');

var Page = R.constant.page;

var _Database = require('./res/_database');
var Immutable = require('immutable');
Immutable.Iterable;

var App = React.createClass({

  //Search tags determine files
  //Files determine which files are allowed in files.open, files.selected

  //"Secondary state" is state that *can* be computed from other state,
  //but is done so via a database read/GET. Secondary state updates when
  //its primary state dependencies change, and this happens in post-render 
  //methods like componentDidMount and componentDidUpdate, so that the
  //calculation (database read) doesn't stall UI render. 
  //Secondary state is stored back in state so that it can be accessed 
  //during the next render cycle. 

  //tagger.files cannot consistently be calculated from the basePage.files
  //state because of user interactions on the Tagger page.
  //Example: When opening Tagger from Search, search.files is copied to
  //tagger.files. However, when a tag is detached from a file, and that
  //tag is currently a search tag, and the file is in search.files, the file 
  //is removed from search.files but NOT from tagger.files.
  
  getInitialState: function() {
    return {
      width: 0,
      accounts: {
        'Dropbox': 'j.doe@gmail.com',
        'Google Drive': 'j.doe.2015@gmail.com',
        'Box': null
      },
      page: Page.CLOUD,
      search: {
        tags: Immutable.OrderedSet(),
        value: "",
        suggestions: {
          visible: true,
          tags: Immutable.OrderedSet(),//secondary state
          requestsPending: 0,
        },
        files: {
          files: Immutable.OrderedMap(),//secondary state
          open: Immutable.Set(),
          selected: Immutable.Set(),
          requestsPending: 0,
        },
      },
      cloud: {
        path: Immutable.List(["Home"]),
        folders: Immutable.List(),//secondary state
        files: {
          files: Immutable.OrderedMap(),//secondary state
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
        currentRequest: null,
      },
      tagger: {
        files: Immutable.OrderedMap(),
        isShowingFiles: false,
        basePage: Page.CLOUD,
        value: "",
        suggestions: {
          tags: Immutable.OrderedSet(),//secondary state
          currentRequest: null,
        }
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
    var suggestionsVisible = searchTags.isEmpty() || this.searchInputIsFocused();

    this.setState({
      page: page,
      search: Update(this.state.search, {
        tags: {$set: searchTags},
        value: {$set: value},
      }),
      cloud: Update(this.state.cloud, {
        path: {$set: path},
        files: {
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
    
    //Note: cannot store Immutable objects in history, 
    //so convert to array
    var browserState = {
      page: this.state.page,
      searchTags: this.state.search.tags.toArray(),
      path: this.state.cloud.path.toArray()
    };
    var url = this.getURL(this.state.page);
    if (replace) {
      window.history.replaceState(browserState, '');
    }
    else {
      window.history.pushState(browserState, '');
    }
  },

  childContextTypes: {
    width: React.PropTypes.number,
  },

  getChildContext: function() {
    return {
      width: this.state.width,
    };
  },

  handleResize: function() {
    //window width, excluding scrollbar
    var width = document.documentElement.clientWidth;
    //do nothing if width hasn't changed
    if (width === this.state.width) {
      return;
    }
    this.setState({
      width: width
    });
  },

  handleMouseDown: function() {
    this.showSearchSuggestions(false);
  },
  
  getURL: function(page) {
    var url;
    switch(page) {
      case Page.SEARCH:
        url = "/search";
        break;
      case Page.CLOUD:
        url = "/home";
        if (!this.state.cloud.path.rest().isEmpty()) {
          url = url + "/" + this.state.cloud.path.rest().join("/");
        }
        break;
      case Page.TAGGER:
        url = this.getURL(this.state.tagger.basePage);
        break;
      default:
        //Invariant: this.state.page should always be one of the above
        throw "NOT A VALID PAGE";
    }
    return url;
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

    //Listen for window resize
    window.addEventListener('resize', this.handleResize);

    //Set initial window width
    this.handleResize();

    //Set initial search suggestions
    //this.showSearchSuggestions(true);
    this.updateSearch(true, false);
  },

  componentDidUpdate: function(prevProps, prevState) {
    var currState = this.state;

    var searchTagsChanged = !Immutable.is(currState.search.tags, prevState.search.tags);
    var searchValueChanged = currState.search.value !== prevState.search.value;
    var updateSuggestions = searchTagsChanged || searchValueChanged;
    var updateFiles = searchTagsChanged;
    this.updateSearch(updateSuggestions, updateFiles);

    var pathChanged = !Immutable.is(currState.cloud.path, prevState.cloud.path);
    this.updateCloud(pathChanged);

    var taggerValueChanged = currState.tagger.value !== prevState.tagger.value;
    this.updateTagger(taggerValueChanged);
  },

  componentWillUnmount: function() {
    //Stop listening for page changes
    window.removeEventListener('popstate', this._setStateFromHistory);

    //Stop listening for window resize
    window.removeEventListener('resize', this.handleResize);
  },

  updateSearch: function(updateSuggestions, updateFiles) {
    //No need to do anything?
    if (!updateSuggestions && !updateFiles) {
      return;
    }
    
    console.log('updateSearch');
    
    var increaseRequestsPending = {};
    if (updateSuggestions) {
      var oneMore = this.state.search.suggestions.requestsPending + 1;
      increaseRequestsPending.suggestions = {
        requestsPending: {$set: oneMore}
      };
    }
    if (updateFiles) {
      var oneMore = this.state.search.files.requestsPending + 1;
      increaseRequestsPending.files = {
        requestsPending: {$set: oneMore},
      };
    }
    this.setState({
      search: Update(this.state.search, increaseRequestsPending)
    }, function() {
      if (updateSuggestions) this._updateSearchSuggestions();
      if (updateFiles) this._updateSearchFiles();
    });
  },

  _updateSearchSuggestions: function() {
    //Search suggestions are calculated from search tags and search value
    //Database should return an Immutable.OrderedSet of strings
    _Database.suggestSearchTags(
      this.state.search.tags, 
      this.state.search.value
    ).then(function(suggestedTags) {
      var oneLess = this.state.search.suggestions.requestsPending - 1;
      this.setState({
        search: Update(this.state.search, {
          suggestions: {
            tags: {$set: suggestedTags},
            requestsPending: {$set: oneLess},
          }
        })
      });
    }.bind(this));
  },

  _updateSearchFiles: function() {
    //Tagger suggestions are calculated from tagger value
    //Database should return an Immutable.OrderedSet of strings
    _Database.filterFiles(
      this.state.search.tags
    ).then(function(files) {
      var selected = this.state.search.files.selected.filter(function(fileId) {
        return files.has(fileId);
      });
      var open = this.state.search.files.open.filter(function(fileId) {
        return files.has(fileId);
      });
      var oneLess = this.state.search.files.requestsPending - 1;
      this.setState({
        search: Update(this.state.search, {
          files: {
            files: {$set: files},
            open: {$set: open},
            selected: {$set: selected},
            requestsPending: {$set: oneLess},
          }
        })
      });
    }.bind(this));
  },

  updateCloud: function(pathChanged) {
    if(!pathChanged) {
      return;
    }
    
    //Path is the home page: don't need to call database
    if (this.state.cloud.path.size === 1) {
      this.setState({
        cloud: Update(this.state.cloud, {
          currentRequest: {$set: null},//clear current request
          folders: {$set: Immutable.List()},
          files: {
            files: {$set: Immutable.OrderedMap()}
          },
        })
      });
      return;
    }
        
    console.log('updateCloud');
    
    var requestId = Util.uuid();
    this.setState({
      cloud: Update(this.state.cloud, {
        currentRequest: {$set: requestId}
      })
    }, function() {
      
      //Use all but first item of path
      _Database.getContents(
        this.state.cloud.path.slice(1).toArray()
      ).then(function(contents) {
        
        //Check if currentRequest matches this request
        if (this.state.cloud.currentRequest !== requestId) {
          return;
        }
        this.setState({
          cloud: Update(this.state.cloud, {
            currentRequest: {$set: null},
            folders: {$set: contents.folders},
            files: {
              files: {$set: contents.files}
            },
          })
        });
      }.bind(this));

    });
  },
  
  updateTagger: function(taggerValueChanged) {
    if (!taggerValueChanged) {
      return;
    }

    //Tagger value is empty: don't need to call database
    if (this.state.tagger.value === '') {
      this.setState({
        tagger: Update(this.state.tagger, {
          suggestions: {
            currentRequest: {$set: null},//clear current request
            tags: {$set: Immutable.OrderedSet()},
          }
        })
      });
      return;
    }
    
    console.log('updateTaggerSuggestions');
    
    //Tagger suggestions are calculated from tagger value
    //Database should return an Immutable.OrderedSet of strings
    var requestId = Util.uuid();
    this.setState({
      tagger: Update(this.state.tagger, {
        suggestions: {
          currentRequest: {$set: requestId},
        }
      })
    }, function() {
      _Database.getTags(
        this.state.tagger.value
      ).then(function(suggestedTags) {

        //Check if current request matches this request
        if (this.state.tagger.suggestions.currentRequest !== requestId) {
          return;
        }
        this.setState({
          tagger: Update(this.state.tagger, {
            suggestions: {
              tags: {$set: suggestedTags},
              currentRequest: {$set: null},
            }
          })
        });
      }.bind(this));
    });
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
    
    var newSearchTags = this.state.search.tags.add(tag);

    //Keep suggestions visible if input is focused
    var suggestionsVisible = this.searchInputIsFocused();
    
    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        value: {$set: ""}
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

    //Show suggestions if there are no search tags
    var suggestionsVisible = newSearchTags.isEmpty();
    
    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
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

    //Suggestion visiblility is already in the correct state
    if (this.state.search.suggestions.visible === visible) {
      return;
    }
    
    this.setState({
      search: Update(this.state.search, {
        suggestions: {
          visible: {$set: visible},
        }
      })
    });
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
    var filesSelected = Immutable.Set.fromKeys(this.state[page].files.files);
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
    //according to files selected on current page

    //files.files - remove files with ids in files.selected
    var searchFilesFiles = searchFiles.files.filter(function(file, id) {
      return !selected.includes(id);
    });
    var cloudFilesFiles = cloudFiles.files.filter(function(file, id) {
      return !selected.includes(id);
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
      var filesToDelete = pageFiles.files.filter(function(file, id) {
        return selected.includes(id);
      });
      var paths = filesToDelete.map(function(file) {
        return file.path.concat([file.name]);
      });
      //Delete files in database
      _Database.deleteFiles(paths.toArray());
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
    this.setState({
      cloud: Update(this.state.cloud, {
        path: {$set: path},
        files: {
          selected: {$set: Immutable.Set()},
          open: {$set: Immutable.Set()}
        }
      })
    }, this.setBrowserState);
  },

  handlePathLengthen: function(folder) {
    this.state.snackbar.complete();
    
    var path = this.state.cloud.path.push(folder);
    this.setState({
      cloud: Update(this.state.cloud, {
        path: {$set: path},
        files: {
          selected: {$set: Immutable.Set()},
          open: {$set: Immutable.Set()}
        }
      })
    }, this.setBrowserState);
  },

  upload: function(files) {
    //Cannot optimistically update file state; must wait for database response
    
    var fileData = {};
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      fileData[file.name] = {
        name: file.name,
        size: file.size,
        mime: file.type,
      };
    }

    var path = this.state.cloud.path;
    
    //Upload files to database
    _Database.uploadFiles(
      fileData, path.rest().toArray()
    ).then(function(cloudFiles) {

      //If path has changed, no need to display files from old path
      if (!Immutable.is(this.state.cloud.path, path)) {
        return;
      }
      //Update cloud files based on database response
      this.setState({
        cloud: Update(this.state.cloud, {
          files: {
            files: {$set: cloudFiles}
          }
        })
      });

    }.bind(this));

  },

  handleFileUpload: function(event) {
    event.stopPropagation();
    event.preventDefault();
    this.upload(event.target.files);
  },

  handleFileDrop: function(event) {
    event.stopPropagation();
    event.preventDefault();
    this.upload(event.dataTransfer.files);
  },


  // TAGGER


  openTagger: function() {
    //Link Tagger to current page
    //Copy selected basePage files to tagger.files
    //Navigate to Tagger page
    var basePage = this.state.page;
    var files = this.state[basePage].files.files.filter(function(file, id) {
      return this.state[basePage].files.selected.includes(id);
    }, this);
    this.setState({
      tagger: Update(this.state.tagger, {
        files: {$set: files},
        basePage: {$set: basePage}
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
    //Collapse header, clear files, clear value
    this.setState({
      tagger: Update(this.state.tagger, {
        files: {$set: Immutable.OrderedMap()},
        isShowingFiles: {$set: false},
        value: {$set: ""},
      })
    });
    this.navigate(this.state.tagger.basePage);
  },

  handleTaggerFocus: function() {
    this.state.snackbar.complete();
  },

  handleTaggerValueChange: function(event) {
    this.state.snackbar.complete();

    //May need to call the rest of this method as part of the
    //snackbar.complete callback, if the database-read in the
    //Tagger re-render can happen before the database-write 
    //in snackbar.complete

    var newValue = this.refs.tagger.refs.tagsOnAllFiles.getInputValue();
    this.setState({
      tagger: Update(this.state.tagger, {
        value: {$set: newValue},
      })
    });
  },

  /**
   * Return a copy of the specified file object 
   * with the specified tag added.
   *
   * @param tag  The tag to attach
   * @param file The file to which the tag will attach
   */
  attachTagToFile: function(tag, file) {
    var newFile = Object.create(file);
    //Duplicate tags not allowed on a file
    newFile.tags = Immutable.OrderedSet(newFile.tags).add(tag).toArray();
    return newFile;
  },

  handleTagAttach: function(tag) {
    //Save previous file states
    var taggerFiles = this.state.tagger.files;
    var searchFileState = this.state.search.files;
    var cloudFileState = this.state.cloud.files;
    
    //Optimistically update file states
    
    //Add tag to tagger files
    var newTaggerFiles = taggerFiles.map(function(file, id) {
      return this.attachTagToFile(tag, file);
    }, this);
    
    //Add tag to search files that are also tagger files
    var newSearchFiles = searchFileState.files.map(function(file, id) {
      if (taggerFiles.has(id)) {
        return this.attachTagToFile(tag, file);
      }
      else {
        return file;
      }
    }, this);

    //Add tag to cloud files that are also tagger files
    var newCloudFiles = cloudFileState.files.map(function(file, id) {
      if (taggerFiles.has(id)) {
        return this.attachTagToFile(tag, file);
      }
      else {
        return file;
      }
    }, this);
    
    //Also add to search files any tagger file that has all search tags.
    //Only need to check to add any tagger files if tag is in search tags.
    var searchTags = this.state.search.tags;
    if (searchTags.includes(tag)) {
      var searchFilesFromTagger = newTaggerFiles.filter(function(file) {
        return searchTags.isSubset(file.tags);
      });
      newSearchFiles = newSearchFiles.merge(searchFilesFromTagger);
    }

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
    
    var fileCount = taggerFiles.size - beforeCount;

    var message = "Added " + '"' + tag + '"' + " to " + fileCount + " file" + (fileCount === 1 ? "" : "s");

    var action = "UNDO";

    var attachTag = function() {
      var paths = taggerFiles.map(function(file) {
        return file.path.concat([file.name]);
      });
      //Attach tag in database
      _Database.attachTag(paths.toArray(), tag);
    };

    var undo = function() {
      //Ensure file state does not change between
      //the point snackbar is shown and the point
      //this method is called.
      
      //Reset file state
      this.setState({
        tagger: Update(this.state.tagger, {
          files: {$set: taggerFiles},
        }),
        search: Update(this.state.search, {
          files: {$set: searchFileState}
        }),
        cloud: Update(this.state.cloud, {
          files: {$set: cloudFileState}
        })
      });
    }.bind(this);

    this.showSnackbar({
      message: message,
      action: action,
      cancel: undo,
      complete: attachTag,
    });
      
  },

  /**
   * Return a copy of the specified file object 
   * without the specified tag.
   *
   * @param tag  The tag to detach
   * @param file The file from which the tag will detach
   */
  detachTagFromFile: function(tag, file) {
    var newFile = Object.create(file);
    newFile.tags = newFile.tags.filter(function(newTag) {
      return newTag !== tag;
    });
    return newFile;
  },

  handleTagDetach: function(tag) {
    //Save previous file states
    var taggerFiles = this.state.tagger.files;
    var searchFileState = this.state.search.files;
    var cloudFileState = this.state.cloud.files;
    
    //Optimistically update file states
    
    //Remove tag from tagger files
    var newTaggerFiles = taggerFiles.map(function(file, id) {
      return this.detachTagFromFile(tag, file);
    }, this);
    
    //Remove tag from search files that are also tagger files
    var newSearchFiles = searchFileState.files.map(function(file, id) {
      if (taggerFiles.has(id)) {
        return this.detachTagFromFile(tag, file);
      }
      else {
        return file;
      }
    }, this);

    //Remove tag from cloud files that are also tagger files
    var newCloudFiles = cloudFileState.files.map(function(file, id) {
      if (taggerFiles.has(id)) {
        return this.detachTagFromFile(tag, file);
      }
      else {
        return file;
      }
    }, this);
    
    //Also remove from any search files that no longer match all search tags
    var searchTags = this.state.search.tags;
    newSearchFiles = newSearchFiles.filter(function(file) {
      return searchTags.isSubset(file.tags);
    });
    
    //Remove open searchFile ids no longer in search files
    var searchFilesOpen = searchFileState.open.filter(function(fileId) {
      return newSearchFiles.has(fileId);
    });
    
    //Remove selected searchFile ids no longer in search files
    var searchFilesSelected = searchFileState.selected.filter(function(fileId) {
      return newSearchFiles.has(fileId);
    });
    
    this.setState({
      tagger: Update(this.state.tagger, {
        files: {$set: newTaggerFiles},
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

    var fileCount = taggerFiles.size;

    var message = "Removed " + '"' + tag + '"' + " from " + fileCount + " file" + (fileCount === 1 ? "" : "s");

    var action = "UNDO";

    var detachTag = function() {
      var paths = taggerFiles.map(function(file) {
        return file.path.concat([file.name]);
      });
      //Detach tag in database
      _Database.detachTag(paths.toArray(), tag);
    };

    var undo = function() {
      //Ensure file state does not change between
      //the point snackbar is shown and the point
      //this method is called.

      //Reset file state
      this.setState({
        tagger: Update(this.state.tagger, {
          files: {$set: taggerFiles},
        }),
        search: Update(this.state.search, {
          files: {$set: searchFileState}
        }),
        cloud: Update(this.state.cloud, {
          files: {$set: cloudFileState}
        })
      });
    }.bind(this);
    
    this.showSnackbar({
      message: message,
      action: action,
      cancel: undo,
      complete: detachTag,
    });
    
  },


  // SNACKBAR


  showSnackbar: function(snackbarState) {
    
    //Complete current snackbar before showing new one
    this.state.snackbar.complete(function() {
      
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
        //If snackbar is showing, wait for it to animate out before calling callback
        var callbackDelay = this.state.snackbar.visible ? Animation.snackbar.leave.duration : 0;
        window.clearTimeout(snackbarTimeoutId);
        snackbarState.complete();
        this.setState({
          snackbar: Update(this.state.snackbar, {
            visible: {$set: false},
            cancel: {$set: Util.noop},
            complete: {$set: Util.call}
          })
        }, function() {
          window.setTimeout(callback, callbackDelay);
        });
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

    }.bind(this));
    
  },


  // App pages

  
  getSearchProps: function() {
    return {
      searchTags: this.state.search.tags,
      searchValue: this.state.search.value,
      
      files: this.state.search.files.files,
      filesSelected: this.state.search.files.selected,
      filesOpen: this.state.search.files.open,
      filesLoading: this.state.search.files.requestsPending > 0,

      suggestions: this.state.search.suggestions.tags,
      suggestionsVisible: this.state.search.suggestions.visible,
      suggestionsLoading: this.state.search.suggestions.requestsPending > 0,
      
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

      loading: this.state.cloud.currentRequest !== null,
      
      onPathShorten: this.handlePathShorten,
      onPathLengthen: this.handlePathLengthen,

      onFileToggle: this.handleFileToggle,
      onFileSelect: this.handleFileSelect,
      onFileSelectAll: this.handleFileSelectAll,
      onFileUnselectAll: this.handleFileUnselectAll,
      onFileDelete: this.handleFileDelete,
      onFileTag: this.openTagger,
      onFileUpload: this.handleFileUpload,
      onFileDrop: this.handleFileDrop,
    };
  },

  getTaggerProps: function() {
    return {
      files: this.state.tagger.files,
      isShowingFiles: this.state.tagger.isShowingFiles,
      onToggle: this.handleTaggerToggle,
      onClose: this.closeTagger,

      taggerValue: this.state.tagger.value,
      
      suggestions: this.state.tagger.suggestions.tags,
      suggestionsLoading: this.state.tagger.suggestions.currentRequest !== null,
      
      onTaggerValueChange: this.handleTaggerValueChange,
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
      default:
        //Invariant: this.state.page should always be one of the above
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
        fontSize: Typography.fontSize,
        fontFamily: Typography.fontFamily,
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        paddingBottom: Dimension.heightAppBarMobile,
        height: '100%'
      },
      appBar: {
        backgroundColor: Color.blue500,
        boxShadow: Shadow.zDepth[1],
        paddingTop: Dimension.quantum,
        paddingBottom: Dimension.quantum,
        paddingRight: Dimension.quantum,
      },
      logo: {
        float: 'left',
        marginLeft: Dimension.marginMobile,
        marginTop: (Dimension.heightActionBar - Dimension.logoHeight) / 2,
        //cursor: 'pointer',
        //put logo above action bar, 
        //to show pointer-cursor
        //position: 'relative',
        //zIndex: 1,
      },
      logoIcon: {
        svg: {
          float: 'left',
        }
      },
      logoText: {
        float: 'left',
        fontSize: Typography.fontSizeLarge,
        lineHeight: Typography.lineHeightLarge,
        fontFamily: Typography.logoFontFamily,
        color: Color.whitePrimary,
        marginLeft: Dimension.space,
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    var page = this.getPage();

    var iconProps = {
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
        <div style={style.appBar}>
            <div style={style.logo}>
                <Logo cloudColor={Color.whitePrimary} 
                      tagColor={Color.blue500}
                      style={style.logoIcon}/>
                <div style={style.logoText}>{Value.appName}</div>
            </div>
            <ActionBar>
                <MaterialIcon action="Search" {...iconProps.search}/>
                <MaterialIcon action="Cloud" {...iconProps.cloud}/>
            </ActionBar>
        </div>
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
      <div style={style.app} onMouseDown={this.handleMouseDown}>
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