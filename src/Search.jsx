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
    
    files: React.PropTypes.object,
    filesSelected: React.PropTypes.instanceOf(Immutable.Set),
    filesOpen: React.PropTypes.instanceOf(Immutable.Set),

    suggestionsVisible: React.PropTypes.bool,
    suggestionsTags: React.PropTypes.instanceOf(Immutable.Set),
    suggestionsTitle: React.PropTypes.string,

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

  getFileProps: function(file) {
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
      isSelected: this.props.filesSelected.includes(file.id),
      isOpen: this.props.filesOpen.includes(file.id),
      onFileSelect: this.props.onFileSelect.bind(null, file.id),
      onFileToggle: this.props.onFileToggle.bind(null, file.id),
      key: file.id
    };
  },

  render: function() {
    var style = this.getStyle();

    var placeholder = this.props.searchTags.isEmpty() ?
                      "Search files by tag" : "Refine search";

    var suggestions = null;
    if (this.props.suggestionsVisible) {
      suggestions = (
        <div>
            <Subheader text={this.props.suggestionsTitle}/>
            <Tags tags={this.props.suggestionsTags}
                  onTagClick={this.props.onSearchTagAdd}
                  style={style.suggestions}/>
        </div>
      );
    }

    var files = this.props.files.map(function(file) {
      return (
        <File {...this.getFileProps(file)}/>
      );
    }, this);

    var fileActionBar = null;
    if (!this.props.searchTags.isEmpty()) {
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