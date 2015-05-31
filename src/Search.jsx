var React = require('react');
var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Subheader = require('./Subheader');
var Files = require('./Files');
var Dimension = require('./res/dimension');


var Search = React.createClass({
  
  propTypes: {
    searchTags: React.PropTypes.array,
    searchValue: React.PropTypes.string,
    searchIsFocused: React.PropTypes.bool,
    searchFiles: React.PropTypes.object,

    suggestedTags: React.PropTypes.array,
    suggestionTitle: React.PropTypes.string,

    onSearchTagAdd: React.PropTypes.func,
    onSearchTagDelete: React.PropTypes.func,

    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    
    onFileSelect: React.PropTypes.func,
    onFileToggle: React.PropTypes.func,
  },

  getTagInputProps: function() {
    return {
      value: this.props.searchValue,
      isFocused: this.props.searchIsFocused,
      handleFocus: this.props.onFocus,
      handleBlur: this.props.onBlur,
      handleChange: this.props.onChange,
      placeholder: "Search files by tag",
      maxWidth: 'none'
    };
  },
  
  getSearchTagNodes: function() {

    return this.props.searchTags.map(function(tag, tagIndex) {

      var onTagClick = function() {
        this.props.onSearchTagDelete(tagIndex);
      }.bind(this);
      
      return (
        <Tag text={tag}
             isDisabled={false}
             onClick={onTagClick}
             key={tag}/>
      );

    }, this);
 
  },

  getSuggestionsNode: function(style) {
    
    if (!this.props.searchIsFocused && this.props.searchTags.length > 0) {
      //If no search tags, even if not focused, show suggestions
      return null;
    }

    var suggestedTagNodes = this.props.suggestedTags.map(function(tag) {

      //Disable tag if it's already a search tag -- should always be false
      var isDisabled = this.props.searchTags.indexOf(tag) >= 0;

      var onTagClick = function() {
        this.props.onSearchTagAdd(tag);
      }.bind(this);

      return (
        <Tag text={tag}
             isDisabled={isDisabled}
             onClick={onTagClick}
             key={tag}/>
      );

    }, this);

    return (
      <div>
          <Subheader text={this.props.suggestionTitle}/>
          <div style={style.suggestions}>
              {suggestedTagNodes}
          </div>
      </div>
    );

  },

  getFilesProps: function() {
    return {
      searchFiles: this.props.searchFiles,
      onFileSelect: this.props.onFileSelect,
      onFileToggle: this.props.onFileToggle,
      disabledTags: this.props.searchTags,
      onTagClick: this.props.onSearchTagAdd,
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
    return (
      <div>

          <div style={style.search}>
              <div style={style.editor}>
                  {this.getSearchTagNodes()}
                  <TagInput {...this.getTagInputProps()}/>
              </div>
              {this.getSuggestionsNode(style)}
          </div>

          <Files {...this.getFilesProps()}/>

      </div>
    );
  }

});

module.exports = Search;