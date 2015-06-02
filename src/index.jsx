var React = require('react/addons');
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Paper = require('./Paper');
var AppBar = require('./AppBar');
var AppBarActions = require('./AppBarActions');
var AppBarAction = require('./AppBarAction');
var MaterialIcon = require('./MaterialIcon');
var MaterialIconCheckboxPartial = require('./MaterialIconCheckboxPartial');
var MaterialIconSearch = require('./MaterialIconSearch');
var MaterialIconCloudQueue = require('./MaterialIconCloudQueue');

var Search = require('./Search');
var ActionBar = require('./ActionBar');

var R = require('./res/index');
var Color = R.color;
var _Database = require('./res/_database');
var Immutable = require('immutable');



var getGlobalStyle = function() {
  return {
    color: Color.blackPrimary,
    fontFamily: 'Roboto, sans-serif',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)'
  };
}



var App = React.createClass({

  //Search tags determine files
  //Files determine which files are allowed in filesOpen, filesSelected
  getInitialState: function() {
    return {
      searchTags: [],
      searchValue: "",
      searchIsFocused: false,
      files: Immutable.Map(),
      filesOpen: Immutable.Set(),
      filesSelected: Immutable.Set(),
    };
  },

  addSearchTag: function(tag) {
    //Add tag to searchTags
    //Update files, based on new search tags
    //Filter filesSelected and filesOpen, based on files
    //Clear searchValue
    var newSearchTags = this.state.searchTags.concat([tag]);
    var newFileState = this.updateFileState(newSearchTags);
    this.setState({
      searchTags: newSearchTags,
      searchValue: "",
      files: newFileState.files,
      filesSelected: newFileState.filesSelected,
      filesOpen: newFileState.filesOpen,
    });
  },

  deleteSearchTag: function(tagIndex) {
    //Remove tag from searchTags
    //Update files, based on new search tags
    //Filter filesSelected and filesOpen, based on files
    var newSearchTags = React.addons.update(this.state.searchTags, {
      $splice: [[tagIndex, 1]]
    });
    var newFileState = this.updateFileState(newSearchTags);
    this.setState({
      searchTags: newSearchTags,
      files: newFileState.files,
      filesSelected: newFileState.filesSelected,
      filesOpen: newFileState.filesOpen,
    });
  },

  updateFileState: function(searchTags) {
    //Returns what the next file state (files, filesSelected, filesOpen) 
    //would look like, given the search tags
    var files = _Database.getFiles(searchTags);
    var filesSelected = this.state.filesSelected.filter(function(fileId) {
      return files.has(fileId);
    });
    var filesOpen = this.state.filesOpen.filter(function(fileId) {
      return files.has(fileId);
    });
    return {
      files: files,
      filesSelected: filesSelected,
      filesOpen: filesOpen
    };
  },

  handleFocus: function() {
    this.setState({searchIsFocused: true});
  },

  handleBlur: function() {
    this.setState({searchIsFocused: false});
  },

  handleChange: function(event) {
    this.setState({searchValue: event.target.value});
  },

  handleFileSelect: function(fileId) {
    var filesSelected = this.state.filesSelected.includes(fileId) ?
                        this.state.filesSelected.delete(fileId) :
                        this.state.filesSelected.add(fileId);
    this.setState({filesSelected: filesSelected});
  },

  handleFileToggle: function(fileId) {
    var filesOpen = this.state.filesOpen.includes(fileId) ?
                        this.state.filesOpen.delete(fileId) :
                        this.state.filesOpen.add(fileId);
    this.setState({filesOpen: filesOpen});
  },

  getSearchProps: function() {
    var suggestedTags = _Database.makeSuggestion(
      this.state.searchValue, 
      this.state.searchTags
    );

    var suggestionTitle = _Database.labelSuggestion(
      this.state.searchValue, 
      this.state.searchTags, 
      suggestedTags
    );

    return {
      searchTags: this.state.searchTags,
      searchValue: this.state.searchValue,
      searchIsFocused: this.state.searchIsFocused,
      files: this.state.files,
      filesSelected: this.state.filesSelected,
      filesOpen: this.state.filesOpen,

      suggestedTags: suggestedTags,
      suggestionTitle: suggestionTitle,
      
      onSearchTagAdd: this.addSearchTag,
      onSearchTagDelete: this.deleteSearchTag,

      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      
      onFileSelect: this.handleFileSelect,
      onFileToggle: this.handleFileToggle,
    };
  },
  
  render: function() {
    return (
      <Search {...this.getSearchProps()}/>
    );
  }

});






var Cloud = React.createClass({
  render: function() {
    var paperStyle = {height:'56px', margin:'0 20px'}
    return(
      <Paper style={paperStyle}>
          <h1>Cloud</h1>
      </Paper>
    );
  }
});






var Main = React.createClass({

  render: function() {
    var actionBarStyle = {
      actionBar: {
        position: 'fixed', bottom: 0, left:0, right: 0, zIndex: 99, 
        backgroundColor: 'limegreen', 
        paddingTop: 4, paddingBottom: 4,
        paddingRight: 4, paddingLeft: 4,
      },
      menu: {bottom: 4, top:'auto'},
    };
    return (
      <div style={getGlobalStyle()}>
          <AppBar>
              <AppBarActions> 
                  <Link to="app"><AppBarAction>
                      <MaterialIconSearch fill={Color.black}
                                          fillOpacity={Color.blackSecondaryOpacity}
                                          style={{}}
                      />
                  </AppBarAction></Link>
                  <Link to="cloud"><AppBarAction>
                      <MaterialIconCloudQueue fill={Color.black}
                                              fillOpacity={Color.blackSecondaryOpacity}
                                              style={{}}
                      />
                  </AppBarAction></Link>
              </AppBarActions>
          </AppBar>
          <MaterialIconCheckboxPartial fill={Color.blue500} fillOpacity={1}/>
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


          <RouteHandler/>

          
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={Main}>
      <Route name="cloud" handler={Cloud}/>
      <DefaultRoute handler={App}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});