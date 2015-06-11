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

var Constants = require('./constants/index');
var Page = Constants.Page;

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Shadow = R.shadow;

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
  //Files determine which files are allowed in filesOpen, filesSelected
  getInitialState: function() {
    return {
      page: Page.SEARCH,
      search: {
        tags: [],
        value: "",
        files: Immutable.Map(),
        filesOpen: Immutable.Set(),
        filesSelected: Immutable.Set(),
        suggestionsVisible: true,
        suggestionsTags: [],
        suggestionsTitle: ""
      },
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: function() {}      
    };
  },

  _setStateFromHistory: function(event) {
    var page = event.state.page;
    var searchTags = event.state.searchTags;
    var fileState = this.updateFileState(searchTags);
    var suggestions = this.updateSuggestions(searchTags, this.state.search.value);
    this.setState({
      page: page,
      search: Update(this.state.search, {
        tags: {$set: searchTags},
        value: {$set: ""},
        files: {$set: fileState.files},
        filesSelected: {$set: Immutable.Set()},
        filesOpen: {$set: Immutable.Set()},
        suggestionsTags: {$set: suggestions.tags},
        suggestionsTitle: {$set: suggestions.title}
      }),
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: function() {}
    });
  },

  componentDidMount: function() {
    //Give first page a non-null state object
    window.history.replaceState({
      page: this.state.page,
      searchTags: this.state.search.tags
    }, '');
    window.addEventListener('popstate', this._setStateFromHistory);

    //Initial tag suggestions
    var suggestions = this.updateSuggestions(
      this.state.search.tags, 
      this.state.search.value
    );
    this.setState({
      search: Update(this.state.search, {
        suggestionsTags: {$set: suggestions.tags},
        suggestionsTitle: {$set: suggestions.title}
      })
    });
  },

  componentWillUnmount: function() {
    window.removeEventListener('popstate', this._setStateFromHistory);
  },

  pushState: function() {
    //Add a browser history entry
    window.history.pushState({
      page: this.state.page,
      searchTags: this.state.search.tags
    }, '');
  },

  addSearchTag: function(tag) {
    //Add tag to search tags
    //Update files, based on new search tags
    //Filter filesSelected and filesOpen, based on files
    //Clear search value

    var newSearchTags = this.state.search.tags.concat([tag]);
    var newFileState = this.updateFileState(newSearchTags);
    var suggestions = this.updateSuggestions(newSearchTags, "");
    
    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        value: {$set: ""},
        files: {$set: newFileState.files},
        filesSelected: {$set: newFileState.filesSelected},
        filesOpen: {$set: newFileState.filesOpen},
        suggestionsVisible: {$set: false},
        suggestionsTags: {$set: suggestions.tags},
        suggestionsTitle: {$set: suggestions.title}
      }),
    }, function() {
      this.pushState();
    });
  },

  deleteSearchTag: function(tagIndex) {
    //Remove tag from search tags
    //Update files, based on new search tags
    //Filter filesSelected and filesOpen, based on files
    //var newSearchTags = this.state.search.tags.delete(tagIndex);
    var newSearchTags = React.addons.update(this.state.search.tags, {
      $splice: [[tagIndex, 1]]
    });
    var newFileState = this.updateFileState(newSearchTags);
    var suggestionsVisible = newSearchTags.length === 0;
    var suggestions = this.updateSuggestions(newSearchTags, this.state.search.value);

    this.setState({
      search: Update(this.state.search, {
        tags: {$set: newSearchTags},
        files: {$set: newFileState.files},
        filesSelected: {$set: newFileState.filesSelected},
        filesOpen: {$set: newFileState.filesOpen},
        suggestionsVisible: {$set: suggestionsVisible},
        suggestionsTags: {$set: suggestions.tags},
        suggestionsTitle: {$set: suggestions.title}
      }),
    }, function() {
      this.pushState();
    });
  },

  handleSearchValueChange: function(event) {
    var newValue = this.refs.search.refs.tagInput.getValue();
    var suggestions = this.updateSuggestions(this.state.search.tags, newValue);
    this.setState({
      search: Update(this.state.search, {
        value: {$set: newValue},
        suggestionsTags: {$set: suggestions.tags},
        suggestionsTitle: {$set: suggestions.title}
      })
    });
  },

  showSuggestions: function(condition) {
    //Show suggestions if condition is true
    //Hide suggestions otherwise

    var isVisible;

    //Exception
    if (this.state.search.tags.length === 0) {
      isVisible = true;
    }
    else {
      isVisible = condition;
    }

    this.setState({
      search: Update(this.state.search, {
        suggestionsVisible: {$set: isVisible}
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

  updateFileState: function(searchTags) {
    //Returns what the next state of files, filesSelected, and filesOpen
    //would look like, given the search tags

    console.log('hit database for files');

    var files = _Database.getFiles(searchTags);
    var filesSelected = this.state.search.filesSelected.filter(
      function(fileId) {
        return files.has(fileId);
      }
    );
    var filesOpen = this.state.search.filesOpen.filter(
      function(fileId) {
        return files.has(fileId);
      }
    );
    return {
      files: files,
      filesSelected: filesSelected,
      filesOpen: filesOpen
    };
  },
  
  handleFileSelect: function(fileId) {
    var filesSelected = this.state.search.filesSelected.includes(fileId) ?
                        this.state.search.filesSelected.delete(fileId) :
                        this.state.search.filesSelected.add(fileId);
    this.setState({
      search: Update(this.state.search, {
        filesSelected: {$set: filesSelected}
      })
    });
  },

  handleFileSelectAll: function() {
    var filesSelected = Immutable.Set.fromKeys(this.state.search.files);
    this.setState({
      search: Update(this.state.search, {
        filesSelected: {$set: filesSelected}
      })
    });
  },

  handleFileUnselectAll: function() {
    this.setState({
      search: Update(this.state.search, {
        filesSelected: {$set: Immutable.Set()}
      })
    });
  },

  handleFileDelete: function() {
    //If no files selected, do nothing
    if (this.state.search.filesSelected.size === 0) {
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
    var filesBeforeDelete = this.state.search.files;
    var filesSelectedBeforeDelete = this.state.search.filesSelected;
    var undoDelete = function() {
      window.clearTimeout(snackbarTimeoutId);
      //Reset files, filesSelected to their states before delete
      this.setState({
        search: Update(this.state.search, {
          files: {$set: filesBeforeDelete},
          filesSelected: {$set: filesSelectedBeforeDelete}
        }),
        snackbarVisible: false
      });
    }.bind(this);
    
    //Optimistically update files - remove ids in filesSelected from files
    var files = this.state.search.files.filter(function(file, fileId) {
      return !this.state.search.filesSelected.includes(fileId);
    }, this);

    //Optimistically update filesSelected
    var filesSelected = Immutable.Set();

    //Show snackbar
    var plural = this.state.search.filesSelected.size !== 1 ? "s" : "";
    this.setState({
      search: Update(this.state.search, {
        files: {$set: files},
        filesSelected: {$set: filesSelected}
      }),
      snackbarVisible: true,
      snackbarMessage: "Deleted " + this.state.search.filesSelected.size + " file" + plural,
      snackbarAction: "UNDO",
      snackbarAct: undoDelete
    });
  },
  
  handleFileToggle: function(fileId) {
    var filesOpen = this.state.search.filesOpen.includes(fileId) ?
                    this.state.search.filesOpen.delete(fileId) :
                    this.state.search.filesOpen.add(fileId);
    this.setState({
      search: Update(this.state.search, {
        filesOpen: {$set: filesOpen}
      })
    });
  },

  getSearchProps: function() {
    return {
      searchTags: this.state.search.tags,
      searchValue: this.state.search.value,
      
      files: this.state.search.files,
      filesSelected: this.state.search.filesSelected,
      filesOpen: this.state.search.filesOpen,

      suggestionsVisible: this.state.search.suggestionsVisible,
      suggestionsTags: this.state.search.suggestionsTags,
      suggestionsTitle: this.state.search.suggestionsTitle,
      
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
  
  getPage() {
    var page;
    switch(this.state.page) {
      case Page.SEARCH:
        page = <Search ref="search" {...this.getSearchProps()}/>;
        break;
      case Page.CLOUD:
        page = <Cloud/>;
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