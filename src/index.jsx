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

var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Subheader = require('./Subheader');
var Files = require('./Files');

var Color = require('./res/color');
var Dimension = require('./res/dimension');

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
      searchFiles: Immutable.Map(),  //depends on searchTags
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

  handleFocus: function() {
    this.setState({searchIsFocused: true});
  },

  handleBlur: function() {
    this.setState({searchIsFocused: false});
  },

  handleChange: function(event) {
    this.setState({searchValue: event.target.value});
  },

  getTagInputProps: function() {
    return {
      value: this.state.searchValue,
      isFocused: this.state.searchIsFocused,
      handleFocus: this.handleFocus,
      handleBlur: this.handleBlur,
      handleChange: this.handleChange,
      placeholder: "Search files by tag",
      maxWidth: 'none'
    };
  },
  
  getSearchProps: function() {

    var searchTagNodes = this.state.searchTags.map(function(tag, tagIndex) {
      return (
        <Tag text={tag}
             isDisabled={false}
             onClick={this.deleteSearchTag.bind(this, tagIndex)}
             key={tag}/>
      );
    }, this);

    var searchInputNode = <TagInput {...this.getTagInputProps()}/>;
    
    var suggestedTags = _Database.makeSuggestion(
      this.state.searchValue, 
      this.state.searchTags
    );
    
    var suggestionTitle = _Database.labelSuggestion(
      this.state.searchValue, 
      this.state.searchTags, 
      suggestedTags
    );

    var suggestedTagNodes = suggestedTags.map(function(tag) {
      //Disable tag if it's already a search tag
      var isDisabled = this.state.searchTags.indexOf(tag) >= 0;//always false?
      return (
        <Tag text={tag}
             isDisabled={isDisabled}
             onClick={this.addSearchTag.bind(this, tag)}
             key={tag}/>
      );
    }, this);

    var suggestionTitleNode = <Subheader text={suggestionTitle}/>;

    return {
      searchTagNodes: searchTagNodes,
      searchInputNode: searchInputNode,
      suggestedTagNodes: this.state.searchIsFocused ? suggestedTagNodes : null,
      suggestionTitleNode: this.state.searchIsFocused ? suggestionTitleNode : null,
    };
  },

  getFilesProps: function() {
    return {
      searchFiles: this.state.searchFiles,
      onFileSelect: this.handleFileSelect,
      onFileToggle: this.handleFileToggle,
      disabledTags: this.state.searchTags,
      onTagClick: this.addSearchTag,
    };
  },

  getStyle: function() {
    return {
      search: {
        paddingTop: 3 * Dimension.space,
        paddingBottom: Dimension.space
      },
      editor: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      suggestions: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
        paddingTop: Dimension.space
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var props = this.getSearchProps();

    return (
      <div>

          <div style={style.search}>
              <div style={style.editor}>
                  {props.searchTagNodes}
                  {props.searchInputNode}
              </div>
              <div>
                  {props.suggestionTitleNode}
                  <div style={style.suggestions}>
                      {props.suggestedTagNodes}
                  </div>
              </div>
          </div>

          <Files {...this.getFilesProps()}/>

      </div>
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
      <DefaultRoute handler={App}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});