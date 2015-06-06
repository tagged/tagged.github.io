var React = require('react');
var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Subheader = require('./Subheader');
var Files = require('./Files');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;


var Search = React.createClass({
  
  propTypes: {
    searchTags: React.PropTypes.array.isRequired,
    searchValue: React.PropTypes.string,
    searchIsFocused: React.PropTypes.bool,

    files: React.PropTypes.object,
    filesSelected: React.PropTypes.object,
    filesOpen: React.PropTypes.object,

    suggestedTags: React.PropTypes.array,
    suggestionTitle: React.PropTypes.string,

    onSearchTagAdd: React.PropTypes.func,
    onSearchTagDelete: React.PropTypes.func,

    onSearchFocus: React.PropTypes.func,
    onSearchBlur: React.PropTypes.func,
    onSearchValueChange: React.PropTypes.func,
    
    onFileSelect: React.PropTypes.func,
    onFileToggle: React.PropTypes.func,
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
          borderColor: this.props.searchIsFocused ? Color.blue500 : Color.blackSecondary
        }
      },
      tag: {
        tag: {
          backgroundColor: Color.blue100,
          cursor: 'pointer',
          outlineColor: Color.blue500
        }
      }      
    };
  },

  render: function() {
    var style = this.getStyle();

    var searchTags = this.props.searchTags.map(function(tag, tagIndex) {

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
             onKeyDown={onKeyDown}
             key={tag}/>
      );

    }, this);

    var tagInput = (function() {

      var placeholder = this.props.searchTags.length === 0 ?
        "Search files by tag" : "Refine search";

      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          this.props.onSearchTagAdd(this.props.searchValue);
        }
      }.bind(this);

      return (
        <TagInput ref="tagInput"
                  value={this.props.searchValue}
                  style={style.tagInput}
                  placeholder={placeholder}
                  onChange={this.props.onSearchValueChange}
                  onKeyDown={onKeyDown}
                  onFocus={this.props.onSearchFocus}
                  onBlur={this.props.onSearchBlur}/>
      );
    }.bind(this))();
    
    var suggestions = null;
    //Show suggestions if focused or if there are no search tags, 
    //even if not focused
    if (this.props.searchIsFocused || this.props.searchTags.length === 0) {
      var suggestedTags = this.props.suggestedTags.map(function(tag) {

        //Mousedown precedes blur
        var onMouseDown = function(event) {
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
               onMouseDown={onMouseDown}
               onKeyDown={onKeyDown}
               key={tag}/>
        );

      }, this);

      suggestions = (
        <div>
            <Subheader text={this.props.suggestionTitle}/>
            <div style={style.suggestions}>
                {suggestedTags}
            </div>
        </div>
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
      </div>
    );
  },

});

module.exports = Search;