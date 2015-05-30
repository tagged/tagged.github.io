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
var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Subheader = require('./Subheader');
var FileTile = require('./FileTile');

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
        metadata: file.metadata,
        tags: file.tags,
        isOpen: false,
        isSelected: false
      });
    }
    return newFiles;
  },
    
  selectFile: function(fileIndex) {
    var newFile = React.addons.update(this.state.files[fileIndex], {
      isSelected: {$set: !this.state.files[fileIndex].isSelected}
    });
    
    var newFiles = React.addons.update(this.state.files, {
      $splice: [[fileIndex, 1, newFile]]
    });
    
    this.setState({files: newFiles}, function() {
      console.log('select');
    });
  },

  toggleFile: function(fileIndex) {
    var newFile = React.addons.update(this.state.files[fileIndex], {
      isOpen: {$set: !this.state.files[fileIndex].isOpen}
    });
    
    var newFiles = React.addons.update(this.state.files, {
      $splice: [[fileIndex, 1, newFile]]
    });
    
    this.setState({files: newFiles}, function() {
      console.log('open');
    });
  },

  findFileIndex: function(fileId) {
    //Find the index of the file with the specified id
    var fileIndex;
    this.state.files.forEach(function(file, index) {
      if (file.id === fileId) {
        fileIndex = index;
      }
    });
    return fileIndex || -1;
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

  getFileTileProps: function(file, fileIndex) {
    
    var tagNodes = file.tags.map(function(tag) {
      //Disable tag if it's already a search tag
      var isDisabled = this.state.searchTags.indexOf(tag) >= 0;
      return (
        <Tag text={tag}
             isDisabled={isDisabled}
             handleClick={this.addSearchTag.bind(this, tag)}
             key={tag}/>
      );
    }, this);
    
    return {
      file: file,
      tagNodes: tagNodes,
      handleSelect: this.selectFile.bind(this, fileIndex),
      handleToggle: this.toggleFile.bind(this, fileIndex),
      key: file.id
    };

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

    var fileNodes = this.state.files.map(function(file, index) {
      return (
        <FileTile {...this.getFileTileProps(file, index)}/>
      );
    }, this);

    var searchTagNodes = this.state.searchTags.map(function(tag, tagIndex) {
      return (
        <Tag text={tag}
             isDisabled={false}
             handleClick={this.deleteSearchTag.bind(this, tagIndex)}
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
             handleClick={this.addSearchTag.bind(this, tag)}
             key={tag}/>
      );
    }, this);

    var suggestionTitleNode = <Subheader text={suggestionTitle}/>;

    return {
      fileNodes: fileNodes,
      searchTagNodes: searchTagNodes,
      searchInputNode: searchInputNode,
      suggestedTagNodes: this.state.isFocused ? suggestedTagNodes : null,
      suggestionTitleNode: this.state.isFocused ? suggestionTitleNode : null,
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

          {props.fileNodes}

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