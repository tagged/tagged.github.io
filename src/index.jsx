var React = require('react/addons');
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();
var ReactTransitionGroup = React.addons.TransitionGroup;

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
      search: Immutable.Map({
        tags: [],
        value: "",
        files: Immutable.Map(),
        filesOpen: Immutable.Set(),
        filesSelected: Immutable.Set(),
        suggestionsVisible: true,
      }),
      snackbarMessage: "",
      snackbarAction: "",
      snackbarAct: function() {}      
    };
  },

  _setStateFromHistory: function(event) {
    var page = event.state.page;
    var searchTags = event.state.searchTags;
    var fileState = this.updateFileState(searchTags);
    var search = this.state.search
                     .set('tags', searchTags)
                     .set('value', "")
                     .set('files', fileState.files)
                     .set('filesSelected', Immutable.Set())
                     .set('filesOpen', Immutable.Set())
                     .set('suggestionsVisible', searchTags.length === 0);
    this.setState({
      page: page,
      search: search,
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
      searchTags: this.state.search.get('tags')
    }, '');
    window.addEventListener('popstate', this._setStateFromHistory);
  },

  componentWillUnmount: function() {
    window.removeEventListener('popstate', this._setStateFromHistory);
  },

  pushState: function() {
    //Add a browser history entry
    window.history.pushState({
      page: this.state.page,
      searchTags: this.state.search.get('tags')
    }, '');
  },

  addSearchTag: function(tag) {
    //Add tag to search tags
    //Update files, based on new search tags
    //Filter filesSelected and filesOpen, based on files
    //Clear search value

    var newSearchTags = this.state.search.get('tags').concat([tag]);
    var newFileState = this.updateFileState(newSearchTags);
    var newSearch = this.state.search
                        .set('tags', newSearchTags)
                        .set('value', "")
                        .set('files', newFileState.files)
                        .set('filesSelected', newFileState.filesSelected)
                        .set('filesOpen', newFileState.filesOpen);
    this.setState({
      search: newSearch,
    }, function() {
      this.pushState();
      this.hideSuggestions();
    });
  },

  deleteSearchTag: function(tagIndex) {
    //Remove tag from search tags
    //Update files, based on new search tags
    //Filter filesSelected and filesOpen, based on files
    //var newSearchTags = this.state.search.get('tags').delete(tagIndex);
    var newSearchTags = React.addons.update(this.state.search.get('tags'), {
      $splice: [[tagIndex, 1]]
    });
    var newFileState = this.updateFileState(newSearchTags);
    var newSearch = this.state.search
                        .set('tags', newSearchTags)
                        .set('files', newFileState.files)
                        .set('filesSelected', newFileState.filesSelected)
                        .set('filesOpen', newFileState.filesOpen);
    this.setState({
      search: newSearch,
    }, function() {
      this.pushState();
      this.hideSuggestions();
    });
  },

  updateFileState: function(searchTags) {
    //Returns what the next state of files, filesSelected, and filesOpen
    //would look like, given the search tags
    var files = _Database.getFiles(searchTags);
    var filesSelected = this.state.search.get('filesSelected').filter(
      function(fileId) {
        return files.has(fileId);
      }
    );
    var filesOpen = this.state.search.get('filesOpen').filter(
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
  
  showSuggestions: function() {
    this.setState({
      search: this.state.search.set('suggestionsVisible', true)
    });
  },

  hideSuggestions: function() {
    //Show suggestions if there are no search tags
    if (this.state.search.get('tags').length === 0) {
      this.setState({
        search: this.state.search.set('suggestionsVisible', true)
      });
    }
    else {
      this.setState({
        search: this.state.search.set('suggestionsVisible', false)
      });
    }
  },

  handleSearchValueChange: function(event) {
    var newValue = this.refs.search.refs.tagInput.getValue();
    this.setState({search: this.state.search.set('value', newValue)});
  },

  handleFileSelect: function(fileId) {
    var filesSelected = this.state.search.get('filesSelected').includes(fileId) ?
                        this.state.search.get('filesSelected').delete(fileId) :
                        this.state.search.get('filesSelected').add(fileId);
    this.setState({
      search: this.state.search.set('filesSelected', filesSelected)
    });
  },

  handleFileSelectAll: function() {
    var filesSelected = Immutable.Set.fromKeys(this.state.search.get('files'));
    this.setState({
      search: this.state.search.set('filesSelected', filesSelected)
    });
  },

  handleFileUnselectAll: function() {
    this.setState({
      search: this.state.search.set('filesSelected', Immutable.Set())
    });
  },

  handleFileDelete: function() {
    //If no files selected, do nothing
    if (this.state.search.get('filesSelected').size === 0) {
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
    var filesBeforeDelete = this.state.search.get('files');
    var filesSelectedBeforeDelete = this.state.search.get('filesSelected');
    var undoDelete = function() {
      window.clearTimeout(snackbarTimeoutId);
      //Reset files, filesSelected to their states before delete
      this.setState({
        search: this.state.search
                    .set('files', filesBeforeDelete)
                    .set('filesSelected', filesSelectedBeforeDelete),
        snackbarVisible: false
      });
    }.bind(this);
    
    //Optimistically update files - remove ids in filesSelected from files
    var files = this.state.search.get('files').filter(function(file, fileId) {
      return !this.state.search.get('filesSelected').includes(fileId);
    }, this);

    //Optimistically update filesSelected
    var filesSelected = Immutable.Set();

    //Show snackbar
    var plural = this.state.search.get('filesSelected').size !== 1 ? "s" : "";
    this.setState({
      search: this.state.search
                  .set('files', files)
                  .set('filesSelected', filesSelected),
      snackbarVisible: true,
      snackbarMessage: "Deleted " + this.state.search.get('filesSelected').size + " file" + plural,
      snackbarAction: "UNDO",
      snackbarAct: undoDelete
    });
  },
  
  handleFileToggle: function(fileId) {
    var filesOpen = this.state.search.get('filesOpen').includes(fileId) ?
                    this.state.search.get('filesOpen').delete(fileId) :
                    this.state.search.get('filesOpen').add(fileId);
    this.setState({
      search: this.state.search.set('filesOpen', filesOpen)
    });
  },

  getSearchProps: function() {
    
    var suggestedTags = _Database.makeSuggestion(
      this.state.search.get('value'), 
      this.state.search.get('tags')
    );

    var suggestionTitle = _Database.labelSuggestion(
      this.state.search.get('value'), 
      this.state.search.get('tags'), 
      suggestedTags
    );

    return {
      searchTags: this.state.search.get('tags'),
      searchValue: this.state.search.get('value'),
      
      files: this.state.search.get('files'),
      filesSelected: this.state.search.get('filesSelected'),
      filesOpen: this.state.search.get('filesOpen'),

      suggestionsVisible: this.state.search.get('suggestionsVisible'),
      suggestedTags: suggestedTags,
      suggestionTitle: suggestionTitle,
      
      onSearchTagAdd: this.addSearchTag,
      onSearchTagDelete: this.deleteSearchTag,

      onSearchFocus: this.showSuggestions,
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
      <div style={style.app} onMouseDown={this.hideSuggestions}>
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