var React = require('react');
var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Subheader = require('./Subheader');
var Files = require('./Files');
var FileActionBar = require('./FileActionBar');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;


var Search = React.createClass({
  
  propTypes: {
    searchTags: React.PropTypes.object,
    searchValue: React.PropTypes.string,
    
    files: React.PropTypes.object,
    filesSelected: React.PropTypes.object,
    filesOpen: React.PropTypes.object,

    suggestionsVisible: React.PropTypes.bool,
    suggestionsTags: React.PropTypes.object,
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
  },

  getStyle: function() {
    return {
      search: {
        paddingTop: 3 * Dimension.space,
        paddingBottom: Dimension.space,
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      suggestions: {
        paddingTop: Dimension.space
      },
      tagInput: {
        input: {
          borderColor: Color.blackSecondary,
          outlineColor: Color.blue500 //focused input
        }
      },
      tag: {
        tag: {
          backgroundColor: Color.blue100,
          cursor: 'pointer',
          outlineColor: Color.blue500
        }
      },
      fileActionBar: {}
    };
  },

  render: function() {
    var style = this.getStyle();

    var searchTags = this.props.searchTags.map(function(tag, tagIndex) {

      var onMouseDown = function(event) {
        //Don't hide suggestions yet
        event.stopPropagation();
      };
      
      var onClick = function(event) {
        this.props.onSearchTagDelete(tagIndex);
      }.bind(this);

      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          this.props.onSearchTagDelete(tagIndex);
        }
      }.bind(this);

      return (
        <Tag text={tag}
             style={style.tag}
             onClick={onClick}
             onMouseDown={onMouseDown}
             onKeyDown={onKeyDown}
             key={tag}/>
      );

    }, this);

    var tagInput = (function() {

      var placeholder = this.props.searchTags.isEmpty() ?
        "Search files by tag" : "Refine search";

      var onMouseDown = function(event) {
        //Don't hide suggestions yet
        event.stopPropagation();
      };

      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          if (this.props.searchValue.length > 0) {
            this.props.onSearchTagAdd(this.props.searchValue);
          }
        }
      }.bind(this);

      return (
        <TagInput ref="tagInput"
                  value={this.props.searchValue}
                  style={style.tagInput}
                  placeholder={placeholder}
                  onChange={this.props.onSearchValueChange}
                  onMouseDown={onMouseDown}
                  onKeyDown={onKeyDown}
                  onFocus={this.props.onSearchFocus}/>
      );
    }.bind(this))();
    
    var suggestions = null;
    if (this.props.suggestionsVisible) {
      var suggestionsTags = this.props.suggestionsTags.map(function(tag) {

        var onMouseDown = function(event) {
          //Don't hide suggestions yet
          event.stopPropagation();
        };

        var onClick = function(event) {
          this.props.onSearchTagAdd(tag);
        }.bind(this);

        var onKeyDown = function(event) {
          if (event.key === 'Enter') {
            this.props.onSearchTagAdd(tag);
          }
        }.bind(this);

        return (
          <Tag text={tag}
               style={style.tag}
               onClick={onClick}
               onMouseDown={onMouseDown}
               onKeyDown={onKeyDown}
               key={tag}/>
        );

      }, this);

      suggestions = (
        <div>
            <Subheader text={this.props.suggestionsTitle}/>
            <div style={style.suggestions}>
                {suggestionsTags}
            </div>
        </div>
      );
    }

    var fileActionBar = null;
    if (!this.props.searchTags.isEmpty()) {
      fileActionBar = (
        <FileActionBar numberOfFiles={this.props.files.size}
                       numberOfFilesSelected={this.props.filesSelected.size}
                       onSelectAll={this.props.onFileSelectAll}
                       onUnselectAll={this.props.onFileUnselectAll}
                       onDelete={this.props.onFileDelete}
                       style={style.fileActionBar}/>
      );
    }

    return (
      <div>
          <div style={style.search}>
              {searchTags}
              {tagInput}
              {suggestions}
          </div>
          <Files files={this.props.files}
                 filesSelected={this.props.filesSelected}
                 filesOpen={this.props.filesOpen}
                 onFileSelect={this.props.onFileSelect}
                 onFileToggle={this.props.onFileToggle}
                 disabledTags={this.props.searchTags}
                 onTagClick={this.props.onSearchTagAdd}/>
          {fileActionBar}
      </div>
    );
  },

});

module.exports = Search;