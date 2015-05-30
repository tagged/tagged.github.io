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
      files: [], //{id, name, metadata, tags, isOpen, isSelected}
      searchTags: [],
      searchValue: "",
      isFocused: false
    };
  },

  addSearchTag: function(tag) {
    //Add tag to search tags, and clear search input
    var newSearchTags = this.state.searchTags.concat([tag]);
    var newFiles = this.updateFiles(newSearchTags);
    this.setState({
      files: newFiles,
      searchTags: newSearchTags,
      searchValue: ""
    });
  },

  deleteSearchTag: function(tagIndex) {
    var newSearchTags = React.addons.update(this.state.searchTags, {
      $splice: [[tagIndex, 1]]
    });
    var newFiles = this.updateFiles(newSearchTags);
    this.setState({
      files: newFiles,
      searchTags: newSearchTags
    });
  },

  updateFiles: function(searchTags) {
    //Calculate files from search tags
    var files = _Database.getFiles(searchTags);
    var newFiles = [];
    for (var i=0; i < files.length; i++) {
      var file = files[i];
      newFiles.push({
        id: file.id,
        name: file.name,
        path: file.path,
        modified: file.modified,
        size: file.size,
        modified: file.modified,
        type: file.type,
        cloud: file.cloud,
        link: file.link,
        tags: file.tags,
        isOpen: false,
        isSelected: false
      });
    }
    return newFiles;
  },
    
  handleFileSelect: function(fileIndex) {
    var newFile = React.addons.update(this.state.files[fileIndex], {
      isSelected: {$set: !this.state.files[fileIndex].isSelected}
    });
    
    var newFiles = React.addons.update(this.state.files, {
      $splice: [[fileIndex, 1, newFile]]
    });
    
    this.setState({files: newFiles});
  },

  handleFileToggle: function(fileIndex) {
    var newFile = React.addons.update(this.state.files[fileIndex], {
      isOpen: {$set: !this.state.files[fileIndex].isOpen}
    });
    
    var newFiles = React.addons.update(this.state.files, {
      $splice: [[fileIndex, 1, newFile]]
    });
    
    this.setState({files: newFiles});
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

  

  getTagInputProps: function() {
    return {
      value: this.state.searchValue,
      isFocused: this.state.isFocused,
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
      suggestedTagNodes: this.state.isFocused ? suggestedTagNodes : null,
      suggestionTitleNode: this.state.isFocused ? suggestionTitleNode : null,
    };
  },

  getFilesProps: function() {
    return {
      files: this.state.files,
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