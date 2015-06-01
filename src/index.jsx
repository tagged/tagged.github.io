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
var MaterialIconSearch = require('./MaterialIconSearch');
var MaterialIconCloudQueue = require('./MaterialIconCloudQueue');

var Search = require('./Search');
var ActionBar = require('./ActionBar');

var Color = require('./res/color');
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

  getInitialState: function() {
    return {
      searchTags: [],
      searchValue: "",
      searchIsFocused: false,
      searchFiles: Immutable.Map(),
    };
  },

  addSearchTag: function(tag) {
    //Add tag to search tags, and clear search input
    var newSearchTags = this.state.searchTags.concat([tag]);
    var newSearchFiles = this.updateSearchFiles(newSearchTags);
    this.setState({
      searchTags: newSearchTags,
      searchValue: "",
      searchFiles: newSearchFiles,
    });
  },

  deleteSearchTag: function(tagIndex) {
    var newSearchTags = React.addons.update(this.state.searchTags, {
      $splice: [[tagIndex, 1]]
    });
    var newSearchFiles = this.updateSearchFiles(newSearchTags);
    this.setState({
      searchTags: newSearchTags,
      searchFiles: newSearchFiles,
    });
  },

  updateSearchFiles: function(searchTags) {
    //Search tags determine files
    //Return type is Immutable.Map
    var files = _Database.getFiles(searchTags);

    //Preserve previous UI state of file (isOpen, isSelected)
    var syncedFiles = files.map(function(file, fileId) {
      var currentFile = this.state.searchFiles.get(fileId);
      file.isSelected = currentFile !== undefined ? currentFile.isSelected : false;
      file.isOpen = currentFile !== undefined ? currentFile.isOpen : false;
      return file;
    }, this);

    return syncedFiles;
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
    var newFiles = this.state.searchFiles.update(fileId, function(file) {
      file.isSelected = !file.isSelected;
      return file;
    });
    this.setState({searchFiles: newFiles});
  },

  handleFileToggle: function(fileId) {
    var newFiles = this.state.searchFiles.update(fileId, function(file) {
      file.isOpen = !file.isOpen;
      return file;
    });
    this.setState({searchFiles: newFiles});
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
      searchFiles: this.state.searchFiles,

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
        backgroundColor: 'limegreen', height: 56, paddingRight: 4
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