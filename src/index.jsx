var React = require('react/addons');
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();
var ReactTransitionGroup = React.addons.TransitionGroup;
var Update = React.addons.update;

var Search = require('./Search');
var Cloud = require('./Cloud');

var MaterialIcon = require('./MaterialIcon');
var ActionBar = require('./ActionBar');
var Snackbar = require('./Snackbar');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Shadow = R.shadow;

var Page = R.constant.page;

var _Database = require('./res/_database');
var Immutable = require('immutable');



var Scratchwork = React.createClass({

  render: function() {
    var actionBarStyle = {
      actionBar: {
        position: 'fixed', bottom: 0, left:0, right: 0, zIndex: 99, 
        backgroundColor: 'limegreen', 
        paddingTop: 4, paddingBottom: 4,
        paddingRight: 4, paddingLeft: 4,
      },
      menu: {menu: {bottom: 4, top:'auto'}},
    };
    return (
      <div>
          <MaterialIcon d={Icon.checkboxPartial}
                        fill={Color.blue500} 
                        fillOpacity={1}/>
          
          <Snackbar message="Hello, this is a really long message. What happens if a message is really long? Let's find out" 
                    action="UNDO"
                    onAction={function(){alert('Undone!')}}/>
          
          <ActionBar style={actionBarStyle}>
              <div action="Blackify" style={{backgroundColor: 'black', width:48, height: 48}}/>
              <div action="Grayify" style={{backgroundColor: 'gray', width:48, height: 48}}/>
              <div action="Indigoify" style={{backgroundColor: 'indigo', width:48, height: 48}}/>
              <div action="Purplify" style={{backgroundColor: 'purple', width:48, height: 48}}/>
              <div action="Yellowify" style={{backgroundColor: 'yellow', width:48, height: 48}}/>
              <div action="Orangify" style={{backgroundColor: 'orange', width:48, height: 48}}/>
              <div action="Redify" style={{backgroundColor: 'red', width:48, height: 48}}/>
              <div action="Pinkify" style={{backgroundColor: 'pink', width:48, height: 48}}/>
              <div action="Blackify" style={{backgroundColor: 'black', width:48, height: 48}}/>
              <div action="Grayify" style={{backgroundColor: 'gray', width:48, height: 48}}/>
              <div action="Indigoify" style={{backgroundColor: 'indigo', width:48, height: 48}}/>
              <div action="Purplify" style={{backgroundColor: 'purple', width:48, height: 48}}/>
              <div action="Yellowify" style={{backgroundColor: 'yellow', width:48, height: 48}}/>
              <div action="Orangify" style={{backgroundColor: 'orange', width:48, height: 48}}/>
              <div action="Redify" style={{backgroundColor: 'red', width:48, height: 48}}/>
              <div action="Pinkify" style={{backgroundColor: 'pink', width:48, height: 48}}/>
          </ActionBar>
      </div>
    );
  }
});



var App = React.createClass({

  //Search tags determine files
  //Files determine which files are allowed in files.open, files.selected
  getInitialState: function() {
    return {
      page: Page.CLOUD,
      search: {
        tags: Immutable.List(),
        value: "",
        files: {
          files: Immutable.Map(),
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
        path: Immutable.List(["Tagged Clouds", "Dropbox", "Samples"]),
        folders: Immutable.List(),
        files: {
          files: Immutable.Map(),
          open: Immutable.Set(),
          selected: Immutable.Set(),
        },
      },
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: function() {}      
    };
  },

  _setStateFromHistory: function(event) {
    var page = event.state.page;
    var searchTags = Immutable.List(event.state.searchTags);
    var value = "";
    var files = this.updateFiles(searchTags);
    var suggestionsVisible = searchTags.isEmpty() || this.searchInputIsFocused();
    var suggestions = this.updateSuggestions(searchTags, value);
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
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: function() {}
    });
  },

  pushState: function() {
    //Add a browser history entry
    //Note: cannot push Immutable.List to history, so converting to array
    window.history.pushState({
      page: this.state.page,
      searchTags: this.state.search.tags.toArray()
    }, '');
  },

  componentDidMount: function() {
    //Give first page a non-null state object
    window.history.replaceState({
      page: this.state.page,
      searchTags: this.state.search.tags.toArray()
    }, '');
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
    window.removeEventListener('popstate', this._setStateFromHistory);
  },

  searchInputIsFocused: function() {
    //Return true if search input is focused
    var inputNode = React.findDOMNode(this.refs.search.refs.tagInput.refs.input);
    return inputNode === document.activeElement;
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
    }, function() {
      this.pushState();
    });
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
    }, function() {
      this.pushState();
    });
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

    console.log('hit database for files');

    var files = _Database.getFiles(searchTags);
    var selected = this.state.search.files.selected.filter(
      function(fileId) {
        return files.has(fileId);
      }
    );
    var open = this.state.search.files.open.filter(
      function(fileId) {
        return files.has(fileId);
      }
    );
    return {
      files: files,
      selected: selected,
      open: open
    };
  },
  
  handleFileToggle: function(fileId) {
    var filesOpen = this.state.search.files.open.includes(fileId) ?
                    this.state.search.files.open.delete(fileId) :
                    this.state.search.files.open.add(fileId);
    this.setState({
      search: Update(this.state.search, {
        files: {
          open: {$set: filesOpen}
        }
      })
    });
  },

  handleFileSelect: function(fileId) {
    var filesSelected = this.state.search.files.selected.includes(fileId) ?
                        this.state.search.files.selected.delete(fileId) :
                        this.state.search.files.selected.add(fileId);
    this.setState({
      search: Update(this.state.search, {
        files: {
          selected: {$set: filesSelected}
        }
      })
    });
  },

  handleFileSelectAll: function() {
    var filesSelected = Immutable.Set.fromKeys(this.state.search.files.files);
    this.setState({
      search: Update(this.state.search, {
        files: {
          selected: {$set: filesSelected}
        }
      })
    });
  },

  handleFileUnselectAll: function() {
    this.setState({
      search: Update(this.state.search, {
        files: {
          selected: {$set: Immutable.Set()}
        }
      })
    });
  },

  handleFileDelete: function() {
    //If no files selected, do nothing
    if (this.state.search.files.selected.size === 0) {
      return;
    }

    //Hide snackbar and delete files after delay
    var snackbarDelay = 2000;
    var snackbarTimeoutId = window.setTimeout(function() {
      //(Delete in database)
      //alert('Files deleted in database!');
      this.setState({
        snackbarVisible: false
      });
    }.bind(this), snackbarDelay);

    //Cancel snackbar
    var filesBeforeDelete = this.state.search.files.files;
    var filesSelectedBeforeDelete = this.state.search.files.selected;
    var undoDelete = function() {
      window.clearTimeout(snackbarTimeoutId);
      //Reset files.files, files.selected to their states before delete
      this.setState({
        search: Update(this.state.search, {
          files: {
            files: {$set: filesBeforeDelete},
            selected: {$set: filesSelectedBeforeDelete}
          }
        }),
        snackbarVisible: false
      });
    }.bind(this);
    
    //Optimistically update files - remove ids in files.selected from files
    var files = this.state.search.files.files.filter(function(file, fileId) {
      return !this.state.search.files.selected.includes(fileId);
    }, this);

    //Optimistically update files.selected
    var filesSelected = Immutable.Set();

    //Show snackbar
    var plural = this.state.search.files.selected.size !== 1 ? "s" : "";
    this.setState({
      search: Update(this.state.search, {
        files: {
          files: {$set: files},
          selected: {$set: filesSelected}
        }
      }),
      snackbarVisible: true,
      snackbarMessage: "Deleted " + this.state.search.files.selected.size + " file" + plural,
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
    };
  },

  handlePathShorten: function(index) {
    var path = this.state.cloud.path.slice(0, index + 1);
    this.setState({
      cloud: Update(this.state.cloud, {
        path: {$set: path}
      })
    });
  },

  getCloudProps: function() {
    return {
      path: this.state.cloud.path,
      folders: this.state.cloud.folders,
      files: this.state.cloud.files,
      onPathShorten: this.handlePathShorten
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
    this.setState({
      page: page
    }, function() {
      this.pushState();
    });
  },

  getStyle: function() {
    return {
      app: {
        color: Color.blackPrimary,
        fontFamily: 'Roboto, sans-serif',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        paddingBottom: Dimension.heightActionBar + Dimension.space + Dimension.quantum,
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

    var snackbar = null;
    if(this.state.snackbarVisible) {
      snackbar = (
        <Snackbar message={this.state.snackbarMessage}
                  action={this.state.snackbarAction}
                  onAction={this.state.snackbarAct}
                  style={style.snackbar}/>
      );
    }

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

    return (
      <div style={style.app} onMouseDown={this.showSuggestions.bind(this, false)}>
          <ActionBar style={style.appBar}>
              <MaterialIcon action="Scratch" {...iconProps.scratchwork}/>
              <MaterialIcon action="Search" {...iconProps.search}/>
              <MaterialIcon action="Cloud" {...iconProps.cloud}/>
          </ActionBar>
          {page}
          <ReactTransitionGroup>
              {snackbar}
          </ReactTransitionGroup>
      </div>
    );
  }

});




React.render(<App/>, document.getElementById('content'));