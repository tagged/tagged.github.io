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
      page: Page.CLOUD,
      search: {
        tags: Immutable.List(),
        value: "",
        files: {
          files: Immutable.List(),
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
        suggestions: {
          visible: true,
          tags: Immutable.List(),
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
      },
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: Util.noop     
    };
  },

  _setStateFromHistory: function(event) {
    var page = event.state.page;
    var searchTags = Immutable.List(event.state.searchTags);
    var path = Immutable.List(event.state.path);

    var value = "";
    var files = this.updateFiles(searchTags);
    var suggestionsVisible = searchTags.isEmpty() || this.searchInputIsFocused();
    var suggestions = this.updateSuggestions(searchTags, value);

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
        },
        suggestions: {
          visible: {$set: suggestionsVisible},
          tags: {$set: suggestions.tags},
          title: {$set: suggestions.title}
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
      }),
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: Util.noop
    });
  },

  pushState: function() {
    //Add a browser history entry
    //Note: cannot push Immutable.List to history, so convert to array
    window.history.pushState({
      page: this.state.page,
      searchTags: this.state.search.tags.toArray(),
      path: this.state.cloud.path.toArray()
    }, '');
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

    //Initial tag suggestions
    var suggestions = this.updateSuggestions(
      this.state.search.tags, 
      this.state.search.value
    );
    this.setState({
      search: Update(this.state.search, {
        suggestions: {
          tags: {$set: suggestions.tags},
          title: {$set: suggestions.title}
        }
      })
    });
  },

  componentWillUnmount: function() {
    //Stop listening for page changes
    window.removeEventListener('popstate', this._setStateFromHistory);
  },

  searchInputIsFocused: function() {
    //Return false if not in SEARCH mode

    if ('search' in this.refs) {
      //Return true if search input is focused
      var inputNode = React.findDOMNode(this.refs.search.refs.tagInput.refs.input);
      return inputNode === document.activeElement;
    }
    return false;
  },

  addSearchTag: function(tag) {
    //Add tag to search tags
    //Update files, based on new search tags
    //Filter files.selected and files.open, based on files
    //Clear search value
    
    //Don't add tag if it's not in suggestions
    if (!this.state.search.suggestions.tags.includes(tag)) {
      return;
    }
    
    var newSearchTags = this.state.search.tags.push(tag);
    var files = this.updateFiles(newSearchTags);

    //Keep suggestions visible if input is focused
    var suggestionsVisible = this.searchInputIsFocused();
    var suggestions = this.updateSuggestions(newSearchTags, "");
    
    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        value: {$set: ""},
        files: {
          files: {$set: files.files},
          open: {$set: files.open},
          selected: {$set: files.selected}
        },
        suggestions: {
          visible: {$set: suggestionsVisible},
          tags: {$set: suggestions.tags},
          title: {$set: suggestions.title}
        }
      }),
    }, this.pushState);
  },

  deleteSearchTag: function(tagIndex) {
    //Remove tag from search tags
    //Update files, based on new search tags
    //Filter files.selected and files.open, based on files

    var newSearchTags = this.state.search.tags.delete(tagIndex);
    var files = this.updateFiles(newSearchTags);

    //Show suggestions if there are no search tags
    var suggestionsVisible = newSearchTags.isEmpty();
    var suggestions = this.updateSuggestions(newSearchTags, this.state.search.value);

    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        files: {
          files: {$set: files.files},
          open: {$set: files.open},
          selected: {$set: files.selected}
        },
        suggestions: {
          visible: {$set: suggestionsVisible},
          tags: {$set: suggestions.tags},
          title: {$set: suggestions.title}
        }
      }),
    }, this.pushState);
  },

  handleSearchValueChange: function(event) {
    var newValue = this.refs.search.refs.tagInput.getValue();
    var suggestions = this.updateSuggestions(
      this.state.search.tags, 
      newValue
    );
    this.setState({
      search: Update(this.state.search, {
        value: {$set: newValue},
        suggestions: {
          tags: {$set: suggestions.tags},
          title: {$set: suggestions.title}
        }
      })
    });
  },

  showSuggestions: function(condition) {
    //Show suggestions if condition is true
    //Hide suggestions otherwise

    var visible;

    //Exception
    if (this.state.search.tags.isEmpty()) {
      visible = true;
    }
    else {
      visible = condition;
    }

    this.setState({
      search: Update(this.state.search, {
        suggestions: {
          visible: {$set: visible}
        }
      })
    });
  },

  updateSuggestions: function(searchTags, searchValue) {
    //Returns suggested tags for the given search tags and search value
    
    console.log('hit db for tag suggestions');

    var tags = _Database.makeSuggestion(searchValue, searchTags);
    var title = _Database.labelSuggestion(searchValue, searchTags, tags);
    return {
      tags: tags,
      title: title
    };
  },

  updateFiles: function(searchTags) {
    //Returns what the next state of files, files selected, and files open
    //would look like, given the search tags

    console.log('ask database for files');

    var files = _Database.getFiles(searchTags);
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

    //If no files selected, do nothing
    if (this.state[page].files.selected.size === 0) {
      return;
    }

    //Hide snackbar and delete files after delay
    var snackbarDelay = 2000;
    var snackbarTimeoutId = window.setTimeout(function() {
      //Delete files in database
      console.log('delete files in database');
      this.setState({
        snackbarVisible: false
      });
    }.bind(this), snackbarDelay);

    //Cancel snackbar
    var filesBeforeDelete = this.state[page].files.files;
    var filesSelectedBeforeDelete = this.state[page].files.selected;
    var undoDelete = function() {
      window.clearTimeout(snackbarTimeoutId);
      //Reset files.files, files.selected to their states before delete
      this.setFileState(page, {
        files: {
          files: {$set: filesBeforeDelete},
          selected: {$set: filesSelectedBeforeDelete}
        }
      });
      this.setState({
        snackbarVisible: false
      });
    }.bind(this);
    
    //Optimistically set file state

    //Update files - remove files with ids in files.selected
    var files = this.state[page].files.files.filter(function(file) {
      return !this.state[page].files.selected.includes(file.id);
    }, this);

    //Clear files.selected
    var filesSelected = Immutable.Set();

    //Show snackbar
    var numberSelected = this.state[page].files.selected.size
    var plural = numberSelected !== 1 ? "s" : "";
    this.setFileState(page, {
      files: {
        files: {$set: files},
        selected: {$set: filesSelected}
      }
    });
    this.setState({
      snackbarVisible: true,
      snackbarMessage: "Deleted " + numberSelected + " file" + plural,
      snackbarAction: "UNDO",
      snackbarAct: undoDelete
    });
  },
  
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

      onSearchFocus: this.showSuggestions.bind(this, true),
      onSearchValueChange: this.handleSearchValueChange,
      
      onFileToggle: this.handleFileToggle,
      onFileSelect: this.handleFileSelect,
      onFileSelectAll: this.handleFileSelectAll,
      onFileUnselectAll: this.handleFileUnselectAll,
      onFileDelete: this.handleFileDelete,
      onFileTag: this.openTagger,
    };
  },

  handlePathShorten: function(index) {
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
    }, this.pushState);
  },

  handlePathLengthen: function(folder) {
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
    }, this.pushState);
  },

  getContents: function(path) {
    //Use all but first item of path
    return _Database.getContents(path.rest());
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

  openTagger: function() {
    //Set Tagger files to selected files on current page, 
    //then navigate to Tagger page.
    var page = this.state.page;
    var files = this.state[page].files.files.filter(function(file) {
      return this.state[page].files.selected.includes(file.id);
    }, this);
    this.setState({
      tagger: Update(this.state.tagger, {
        files: {$set: files}
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
        page = <Tagger files={this.state.tagger.files}
                       isShowingFiles={this.state.tagger.isShowingFiles}
                       onToggle={this.handleTaggerToggle}/>;
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
    if (page === this.state.page) {
      return;
    }
    this.setState({
      page: page
    }, this.pushState);
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
      },
      snackbar: {}
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
    if(this.state.snackbarVisible) {
      snackbar = (
        <Snackbar message={this.state.snackbarMessage}
                  action={this.state.snackbarAction}
                  onAction={this.state.snackbarAct}
                  style={style.snackbar}/>
      );
    }

    return (
      <div style={style.app} onMouseDown={this.showSuggestions.bind(this, false)}>
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