var React = require('react');
var Tags = require('./Tags');
var Subheader = require('./Subheader');
var TextSingle = require('./TextSingle');
var File = require('./File');
var FileActionBar = require('./FileActionBar');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Page = R.constant.page;
var Shadow = R.shadow;
var Typography = R.typography;
var Util = require('./util/util');
var Immutable = require('immutable');
var FileStore = require('./res/FileStore');


var Search = React.createClass({
  
  propTypes: {
    searchTags: React.PropTypes.instanceOf(Immutable.Set),
    searchValue: React.PropTypes.string,
    
    files: React.PropTypes.array,
    filesDeleted: React.PropTypes.instanceOf(Immutable.Set),
    filesSelected: React.PropTypes.instanceOf(Immutable.Set),

    suggestionsVisible: React.PropTypes.bool,

    onSearchTagAdd: React.PropTypes.func,
    onSearchTagDelete: React.PropTypes.func,

    onSearchFocus: React.PropTypes.func,
    onSearchValueChange: React.PropTypes.func,
    
    onFileSelect: React.PropTypes.func,
    onFileSelectAll: React.PropTypes.func,
    onFileUnselectAll: React.PropTypes.func,
    onFileDelete: React.PropTypes.func,
    onFileTag: React.PropTypes.func,
    onFileOpen: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      search: {
        paddingBottom: Dimension.heightActionBar + Dimension.space + Dimension.quantum
      },
      header: {
        paddingTop: Dimension.space,
        paddingBottom: Dimension.space,
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      title: {
        root: {
          color: Color.blackSecondary,
          fontWeight: Typography.fontWeightMedium,
        }
      },
      suggestions: {
        tags: {
          paddingTop: Dimension.space
        }
      },
      fileActionBar: {
        root: {
          boxShadow: Shadow.zDepthTop[1],
        }
      },
      searchTags: {
        tag: {
          tag: {
            backgroundColor: Color.blue500,
            color: Color.whitePrimary,
            outlineColor: Color.blue900,
          }
        }
      },
    };
  },

  getFileProps: function(file) {
    var path = file.path.join('/');
    return {
      name: file.path[file.path.length - 1],
      path: Util.makePath(file.path.slice(0,-1)),
      modified: file.modified,
      size: file.size,
      type: file.type,
      cloud: file.path[0],
      link: file.link,
      tags: Immutable.OrderedSet(file.tags),
      specialTags: this.props.searchTags,
      onTagClick: this.props.onSearchTagAdd,
      onSpecialTagClick: this.props.onSearchTagDelete,
      isSelected: this.props.filesSelected.includes(path),
      onFileSelect: this.props.onFileSelect.bind(null, path),
      onFileOpen: this.props.onFileOpen.bind(null, path),
      key: path
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var searchTags = this.props.searchTags;
    var searchValue = this.props.searchValue;
    
    var allFiles = FileStore.getFiles(this.props.files);
    var allTags = FileStore.getTags(allFiles);

    // FILES

    var searchFiles = FileStore.filterFiles(allFiles, searchTags);
      
    //Filter out deleted files
    searchFiles = searchFiles.filter(function(file) {
      return !this.props.filesDeleted.includes(file.path.join('/'));
    }, this);

    //Sort by name
    searchFiles.sort(FileStore.sortFilesByName);

    var files = searchFiles.map(function(file) {
      return <File {...this.getFileProps(file)}/>;
    }, this);
    
    // FILE ACTION BAR
    
    var searchFilePaths = searchFiles.map(function(file) {
      return file.path.join('/');
    });
    
    var fileActionBar = null;
    if (!searchTags.isEmpty()) {
      fileActionBar = (
        <FileActionBar numberOfFiles={searchFiles.length}
                       numberOfFilesSelected={this.props.filesSelected.size}
                       onSelectAll={this.props.onFileSelectAll.bind(null, searchFilePaths)}
                       onUnselectAll={this.props.onFileUnselectAll}
                       onDelete={this.props.onFileDelete.bind(null, this.props.filesSelected)}
                       onTag={this.props.onFileTag}
                       style={style.fileActionBar}/>
      );
    }

    // SUGGESTIONS

    var suggestions = null;
    if (this.props.suggestionsVisible) {
      
      var tags;
      if (searchTags.isEmpty()) {
        if (searchValue === '') {
          //Suggest all tags
          tags = allTags.sort();
        } else {
          //Suggest all tags starting with value
          tags = allTags.filter(function(tag) {
            return tag.indexOf(searchValue) === 0;
          }).sort();
        }
      } else {
        //Suggest tags on search files starting with value
        tags = FileStore.getTagsStartingWith(searchFiles, searchValue).
                         subtract(searchTags). //exclude search tags
                         sort();
      }

      var label;
      var haveSuggestions = tags.size > 0;
      if (searchValue === "") {
        if (searchTags.isEmpty()) {
          label = haveSuggestions ? 
                  "All " + tags.size + " tags" : 
                  "No tags exist yet";
        } else {
          label = haveSuggestions ? 
                  "Refine search" : 
                  "No tags to refine search";
        }
      } else {
        if (searchTags.isEmpty()) {
          label = haveSuggestions ? 
                  ('"' + searchValue + '" tags') : 
                  ('No "' + searchValue + '" tags');
        } else {
          label = haveSuggestions ? 
                  ('"' + searchValue + '" tags to refine search') : 
                  ('No "' + searchValue + '" tags to refine search');
        }
      }
      suggestions = (
        <div>
            <Subheader text={label}/>
            <Tags tags={tags}
                  onTagClick={this.props.onSearchTagAdd}
                  style={style.suggestions}/>
        </div>
      );
      
    }

    var placeholder = searchTags.isEmpty() ? 
                      "Search files by tag" : 
                      "Refine search";

    return (
      <div style={style.search}>
          <div style={style.header}>
              <TextSingle text="Search" style={style.title}/>
              <Tags ref="searchTags"
                    tags={searchTags}
                    onTagClick={this.props.onSearchTagDelete}
                    style={style.searchTags}
                    withInput={true}
                    value={searchValue}
                    onValueChange={this.props.onSearchValueChange}
                    placeholder={placeholder}
                    onSubmit={this.props.onSearchTagAdd}
                    onFocus={this.props.onSearchFocus}/>
              {suggestions}
          </div>
          {files}
          {fileActionBar}
      </div>
    );
  },

});

module.exports = Search;