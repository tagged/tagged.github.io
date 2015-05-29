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
var FileTile = require('./FileTile');
var TagSearch = require('./TagSearch');

var Color = require('./res/color');
var Dimension = require('./res/dimension');

var _Files = require('./res/_files');
var _Tags = require('./res/_tags');





var getGlobalStyle = function() {
  return {
    color: Color.blackPrimary,
    fontFamily: 'Roboto, sans-serif',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)'
  };
}





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





var Search = React.createClass({
  
  getInitialState: function() {
    return {
      files: _Files,
      searchTags: [],
      searchValue: "",
      isFocused: false
    };
  },

  handleFocus: function() {
    this.setState({isFocused: true});
  },

  handleBlur: function() {
    this.setState({isFocused: false});
  },

  handleChange: function(event) {
    this.setState({searchValue: event.target.value});
  },

  getTagSearchProps: function() {
    return {
      searchTags: this.state.searchTags,
      addSearchTag: this.addSearchTag,
      deleteSearchTag: this.deleteSearchTag,
      searchValue: this.state.searchValue,
      isFocused: this.state.isFocused,
      handleFocus: this.handleFocus,
      handleBlur: this.handleBlur,
      handleChange: this.handleChange
    };
  },

  getFileTileProps: function(file) {
    return {
      filename: file.name,
      metadata: file.metadata,
      tags: file.tags,
      isChecked: file.isChecked,
      isOpen: file.isOpen,
      handleCheck: this.selectFile.bind(this, file.name),
      handleToggle: this.toggleFile.bind(this, file.name),
      key: file.name
    };
  },

  render: function() {
    
    var fileTiles = this.state.files.map(function(file) {
      return (
            <FileTile {...this.getFileTileProps(file)}/>
      );
    }, this);

    return(
      <div onClick={this.handleClick}>
          <TagSearch ref="search" {...this.getTagSearchProps()}/>
          {fileTiles}
      </div>
    );
  },
    
  addSearchTag: function(tag) {
    //Add tag to search tags, and clear search input
    this.setState({
      searchTags: this.state.searchTags.concat([tag]),
      searchValue: ""
    });
  },

  deleteSearchTag: function(tag) {
    var newSearchTags = this.state.searchTags.filter(function(searchTag) {
      return searchTag !== tag;
    });
    this.setState({
      searchTags: newSearchTags
    });
  },

  selectFile: function(fileName) {
    this.toggle(fileName, 'isChecked', 'clicked checkbox');
  },

  toggleFile: function(fileName) {
    this.toggle(fileName, 'isOpen', 'toggled collapsible');
  },

  toggle: function(fileName, fileProperty, message) {
    //Toggle a boolean file property

    var newFiles = this.state.files.map(function(file) {
      if (fileName !== file.name) {
        return file;
      } else {
        var fileCopy = file;
        fileCopy[fileProperty] = !file[fileProperty];
        return fileCopy;
      }
    });

    this.setState({
      files: newFiles
    }, function() {
      console.log(message);
    });
  }

});



var Main = React.createClass({

  render: function() {
    return (
      <div  style={getGlobalStyle()}>
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


          <RouteHandler/>

          
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={Main}>
      <Route name="cloud" handler={Cloud}/>
      <DefaultRoute handler={Search}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});