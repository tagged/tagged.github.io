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

    suggestionsVisible: React.PropTypes.bool,
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
      tag: {
        tag: {
          backgroundColor: Color.blue100,
          cursor: 'pointer'
        }
      }      
    };
  },

  render: function() {
    var style = this.getStyle();

    var searchTags = this.props.searchTags.map(function(tag, tagIndex) {

      var onClick = function(event) {
        event.stopPropagation();
        this.props.onSearchTagDelete(tagIndex);
      }.bind(this);

      return (
        <Tag text={tag}
             style={style.tag}
             onClick={onClick}
             onKeyUp={this.handleKeyUp}
             onKeyDown={this.handleKeyDown}
             key={tag}/>
      );

    }, this);

    var tagInput = (function() {

      var placeholder = this.props.searchTags.length === 0 ?
        "Search files by tag" : "Refine search";

      var onClick = function(event) {
        event.stopPropagation();
        this.props.onSearchFocus();
      }.bind(this);
      
      return (
        <TagInput ref="tagInput"
                  isFocused={this.props.searchIsFocused}
                  value={this.props.searchValue}
                  placeholder={placeholder}
                  onChange={this.props.onSearchValueChange}
                  onClick={onClick}
                  onKeyUp={this.handleKeyUp}
                  onKeyDown={this.handleKeyDown}/>
      );
    }.bind(this))();
    
    var suggestions = null;
    //Show suggestions if focused or if there are no search tags, even if not focused
    if (this.props.suggestionsVisible) {
      var suggestedTags = this.props.suggestedTags.map(function(tag) {

        var onClick = function(event) {
          event.stopPropagation();
          this.props.onSearchTagAdd(tag);
        }.bind(this);

        return (
          <Tag text={tag}
               style={style.tag}
               onClick={onClick}
               onKeyUp={this.handleKeyUp}
               onKeyDown={this.handleKeyDown}
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
                 onTagClick={this.props.onSearchTagAdd}
                 onKeyUp={this.handleKeyUp}
                 onKeyDown={this.handleKeyDown}/>
      </div>
    );
  },

  handleKeyUp: function(event) {
    //console.log(event,event.target,event.currentTarget,event.type);
    //Handle tab in
    if (event.key === 'Tab') {
      var inputNode = React.findDOMNode(this.refs.tagInput.refs.input);
      if (event.target.isEqualNode(inputNode)) {
        this.props.onSearchFocus();
      }
    }
  },

  handleKeyDown: function(event) {
    //Handle tab out
    if (event.key === 'Tab') {
      this.props.onSearchBlur();
    }
  }

});

module.exports = Search;