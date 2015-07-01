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
var FileStore = require('./res/FileStore');



var App = React.createClass({

  getInitialState: function() {
    return {
      files: FileStore.getAll(),
      
      //temporarily store deleted file paths while snackbar shows, 
      //but before files are deleted from FileStore
      filesDeleted: Immutable.Set(),
      
      //temporarily store tags attached/detached while snackbar shows, 
      //but before they are attached/detached in FileStore
      tagsAttached: Immutable.Set(),
      tagsDetached: Immutable.Set(),
      
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
        },
        files: {
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
      },
      cloud: {
        path: Immutable.List(["Home"]),
        files: {
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
      },
      tagger: {
        files: Immutable.Set(),
        isShowingFiles: false,
        basePage: Page.CLOUD,
        value: "",
      },
      snackbar: {
        visible: false,
        message: "",
        action: "",
        cancel: Util.noop,//reject
        complete: Util.call,//resolve
        //Note: when calling snackbar.complete in parallel,
        //watch out for batched setState calls
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
        files: {
          open: {$set: Immutable.Set()},
          selected: {$set: Immutable.Set()}
        }
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

  },

  componentWillUnmount: function() {
    //Stop listening for page changes
    window.removeEventListener('popstate', this._setStateFromHistory);

    //Stop listening for window resize
    window.removeEventListener('resize', this.handleResize);
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
        files: {
          open: {$set: Immutable.Set()},
          selected: {$set: Immutable.Set()}
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

  handleFileToggle: function(filePath) {
    this.state.snackbar.complete();
    
    var page = this.state.page;
    var filesOpen = this.state[page].files.open.includes(filePath) ?
                    this.state[page].files.open.delete(filePath) :
                    this.state[page].files.open.add(filePath);
    this.setFileState(page, {
      files: {
        open: {$set: filesOpen}
      }
    });
  },

  handleFileSelect: function(filePath) {
    this.state.snackbar.complete();
    
    var page = this.state.page;
    var filesSelected = this.state[page].files.selected.includes(filePath) ?
                        this.state[page].files.selected.delete(filePath) :
                        this.state[page].files.selected.add(filePath);
    this.setFileState(page, {
      files: {
        selected: {$set: filesSelected}
      }
    });
  },

  handleFileSelectAll: function(filePaths) {
    this.setFileState(this.state.page, {
      files: {
        selected: {$set: Immutable.Set(filePaths)}
      }
    });
  },

  handleFileUnselectAll: function() {
    this.setFileState(this.state.page, {
      files: {
        selected: {$set: Immutable.Set()}
      }
    });
  },

  //@param {Immutable.Set} file paths to delete
  handleFileDelete: function(filePaths) {

    //No files to delete?
    if (filePaths.size === 0) {
      return;
    }

    //Save previous file states
    var searchFileState = this.state.search.files;
    var cloudFileState = this.state.cloud.files;

    //Optimistically delete files and clear file state
    var searchFilesSelected = searchFileState.selected.filter(function(path) {
      return !filePaths.includes(path);
    });
    var searchFilesOpen = searchFileState.open.filter(function(path) {
      return !filePaths.includes(path);
    });
    var cloudFilesSelected = cloudFileState.selected.filter(function(path) {
      return !filePaths.includes(path);
    });
    var cloudFilesOpen = cloudFileState.open.filter(function(path) {
      return !filePaths.includes(path);
    });
    this.setState({
      filesDeleted: filePaths,
      search: Update(this.state.search, {
        files: {
          open: {$set: searchFilesOpen},
          selected: {$set: searchFilesSelected}
        }
      }),
      cloud: Update(this.state.cloud, {
        files: {
          open: {$set: cloudFilesOpen},
          selected: {$set: cloudFilesSelected}
        }
      }),
    });

    //Show snackbar
    var numberSelected = filePaths.size;
    var plural = numberSelected !== 1 ? "s" : "";
    var message = "Deleted " + numberSelected + " file" + plural;
    var action = "UNDO";

    var deleteFiles = function() {
      FileStore.deleteFiles(filePaths.toArray());
      this.setState({
        files: FileStore.getAll(),
        filesDeleted: Immutable.Set()
      });
    }.bind(this);

    var undoDelete = function() {
      //Reset file state
      this.setState({
        filesDeleted: Immutable.Set(),
        search: Update(this.state.search, {
          files: {$set: searchFileState}
        }),
        cloud: Update(this.state.cloud, {
          files: {$set: cloudFileState}
        }),
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
        
    var fileData = {};
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      fileData[file.name] = {
        name: file.name,
        size: file.size,
        mime: file.type,
      };
    }

    //Upload file information to FileStore
    FileStore.uploadFiles(
      fileData, this.state.cloud.path.rest().toArray()
    );

    //Update files
    this.setState({
      files: FileStore.getAll()
    });
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
    this.setState({
      tagger: Update(this.state.tagger, {
        files: {$set: this.state[basePage].files.selected},
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
        files: {$set: Immutable.Set()},
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

    var newValue = this.refs.tagger.refs.tagsOnAllFiles.getInputValue();
    this.setState({
      tagger: Update(this.state.tagger, {
        value: {$set: newValue},
      })
    });
  },

  //@param tagCount {object} map of tag counts for tagger files (before attach)
  //@param tag {string} tag to attach
  handleTagAttach: function(tagCount, tag) {
    
    //Prepare snackbar

    var count = this.state.tagger.files.size;
    if (tag in tagCount) {
      count -= tagCount[tag];//subtract files that already have the tag
    }

    var message = "Added " + '"' + tag + '"' + " to " + count + " file" + (count === 1 ? "" : "s");

    var action = "UNDO";

    var attachTag = function() {
      //Attach tag in FileStore
      FileStore.attachTag(this.state.tagger.files.toArray(), tag);
      this.setState({
        files: FileStore.getAll(),
        tagsAttached: this.state.tagsAttached.delete(tag),
      });
    }.bind(this);

    var undo = function() {
      //Reset state
      this.setState({
        tagsAttached: this.state.tagsAttached.delete(tag),
      });
    }.bind(this);

    //Optimistically attach tag
    this.setState({
      tagsAttached: this.state.tagsAttached.add(tag),
      tagger: Update(this.state.tagger, {
        value: {$set: ""},
      })
    }, function() {
      
      this.showSnackbar({
        message: message,
        action: action,
        cancel: undo,
        complete: attachTag,
      });
      
    });  
  },

  //@param tag {string} tag to detach
  handleTagDetach: function(tag) {
    
    //Prepare snackbar

    var count = this.state.tagger.files.size;

    var message = "Removed " + '"' + tag + '"' + " from " + count + " file" + (count === 1 ? "" : "s");

    var action = "UNDO";

    var detachTag = function() {
      //Detach tag in database
      FileStore.detachTag(this.state.tagger.files.toArray(), tag);
      this.setState({
        files: FileStore.getAll(),
        tagsDetached: this.state.tagsDetached.delete(tag),
      });
    }.bind(this);

    var undo = function() {
      //Reset state
      this.setState({
        tagsDetached: this.state.tagsDetached.delete(tag),
      });
    }.bind(this);
    
    //Optimistically detach tag
    this.setState({
      tagsDetached: this.state.tagsDetached.add(tag),
      tagger: Update(this.state.tagger, {
        value: {$set: ""},
      })
    }, function() {
      
      this.showSnackbar({
        message: message,
        action: action,
        cancel: undo,
        complete: detachTag,
      });

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
      
      files: this.state.files,
      filesDeleted: this.state.filesDeleted,
      filesSelected: this.state.search.files.selected,
      filesOpen: this.state.search.files.open,
      
      suggestionsVisible: this.state.search.suggestions.visible,
      
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

      files: this.state.files,
      filesDeleted: this.state.filesDeleted,
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
      onFileUpload: this.handleFileUpload,
      onFileDrop: this.handleFileDrop,
    };
  },

  getTaggerProps: function() {
    return {
      files: this.state.files,
      taggerFiles: this.state.tagger.files,
      isShowingFiles: this.state.tagger.isShowingFiles,

      tagsAttached: this.state.tagsAttached,
      tagsDetached: this.state.tagsDetached,

      onToggle: this.handleTaggerToggle,
      onClose: this.closeTagger,

      taggerValue: this.state.tagger.value,

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