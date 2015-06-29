var React = require('react');
var Tags = require('./Tags');
var Subheader = require('./Subheader');
var File = require('./File');
var FileActionBar = require('./FileActionBar');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Util = require('./util/util');
var Immutable = require('immutable');



var Search = React.createClass({
  
  propTypes: {
    searchTags: React.PropTypes.instanceOf(Immutable.Set),
    searchValue: React.PropTypes.string,
    
    files: React.PropTypes.instanceOf(Immutable.OrderedMap),
    filesSelected: React.PropTypes.instanceOf(Immutable.Set),
    filesOpen: React.PropTypes.instanceOf(Immutable.Set),
    filesLoading: React.PropTypes.bool,

    suggestions: React.PropTypes.instanceOf(Immutable.OrderedSet),
    suggestionsLoading: React.PropTypes.bool,
    suggestionsVisible: React.PropTypes.bool,

    onSearchTagAdd: React.PropTypes.func,
    onSearchTagDelete: React.PropTypes.func,

    onSearchFocus: React.PropTypes.func,
    onSearchValueChange: React.PropTypes.func,
    
    onFileToggle: React.PropTypes.func,
    onFileSelect: React.PropTypes.func,
    onFileSelectAll: React.PropTypes.func,
    onFileUnselectAll: React.PropTypes.func,
    onFileDelete: React.PropTypes.func,
    onFileTag: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      search: {
        paddingBottom: Dimension.heightActionBar + Dimension.space + Dimension.quantum
      },
      header: {
        paddingTop: 3 * Dimension.space,
        paddingBottom: Dimension.space,
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      suggestions: {
        tags: {
          paddingTop: Dimension.space
        }
      }
    };
  },

  getFileProps: function(file, id) {
    return {
      name: file.name,
      path: Util.makePath(file.path),
      modified: file.modified,
      size: file.size,
      type: file.type,
      cloud: file.cloud,
      link: file.link,
      tags: Immutable.OrderedSet(file.tags),
      disabledTags: this.props.searchTags,
      onTagClick: this.props.onSearchTagAdd,
      isSelected: this.props.filesSelected.includes(id),
      isOpen: this.props.filesOpen.includes(id),
      onFileSelect: this.props.onFileSelect.bind(null, id),
      onFileToggle: this.props.onFileToggle.bind(null, id),
      key: id
    };
  },

  render: function() {
    var style = this.getStyle();

    var placeholder = this.props.searchTags.isEmpty() ?
                      "Search files by tag" : "Refine search";

    var suggestions = null;
    if (this.props.suggestionsVisible) {

      //Don't show search suggestions while they are loading

      if (this.props.suggestionsLoading) {
        suggestions = null;//<div>LOADING...</div>;
      }

      //Otherwise, show suggestions

      else {
        //Calculate suggestions label
        var haveSuggestions = this.props.suggestions.size > 0;
        var label;
        var searchTags = this.props.searchTags;
        var searchValue = this.props.searchValue;
        if (searchValue === "") {
          if (searchTags.isEmpty()) {
            label = haveSuggestions ? 
                    "All " + this.props.suggestions.size + " tags" : 
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
              <Tags tags={this.props.suggestions}
                    onTagClick={this.props.onSearchTagAdd}
                    style={style.suggestions}/>
          </div>
        );
      }
    }

    var files;
    if (this.props.filesLoading) {
      files = null;//<Loading/>
    }
    else {
      //Sort files by name
      files = this.props.files.sort(Util.sortByName).map(function(file, id) {
        return (
          <File {...this.getFileProps(file, id)}/>
        );
      }, this).valueSeq();
    }

    var fileActionBar = null;
    if (this.props.filesLoading) {
      fileActionBar = null;//<Loading/>
    }
    else if (!this.props.searchTags.isEmpty()) {
      fileActionBar = (
        <FileActionBar numberOfFiles={this.props.files.size}
                       numberOfFilesSelected={this.props.filesSelected.size}
                       onSelectAll={this.props.onFileSelectAll}
                       onUnselectAll={this.props.onFileUnselectAll}
                       onDelete={this.props.onFileDelete}
                       onTag={this.props.onFileTag}
                       style={style.fileActionBar}/>
      );
    }

    return (
      <div style={style.search}>
          <div style={style.header}>
              <Tags ref="searchTags"
                    tags={this.props.searchTags}
                    onTagClick={this.props.onSearchTagDelete}
                    withInput={true}
                    value={this.props.searchValue}
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