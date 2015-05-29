var React = require('react/addons');
var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');
var Util = require('./util/util');

var TagSearchEditor = React.createClass({

  propTypes: {
    searchTags: React.PropTypes.array,
    searchValue: React.PropTypes.string.isRequired,
    deleteSearchTag: React.PropTypes.func.isRequired,
    isFocused: React.PropTypes.bool.isRequired,
    handleFocus: React.PropTypes.func.isRequired,
    handleBlur: React.PropTypes.func.isRequired,
    handleChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      searchTags: []
    };
  },
  
  getStyle: function() {
    return {
      component: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      }
    };
  },
  
  getTagInputProps: function() {
    return {
      value: this.props.searchValue,
      isFocused: this.props.isFocused,
      handleFocus: this.props.handleFocus,
      handleBlur: this.props.handleBlur,
      handleChange: this.props.handleChange,
      placeholder: "Search files by tag",
      maxWidth: 'none'
    };
  },

  render: function() {
    var style = this.getStyle();

    var searchTagNodes = this.props.searchTags.map(function(tag) {
      return (
        <Tag text={tag}
             isDisabled={false}
             handleClick={this.props.deleteSearchTag}
             key={tag}/>
      );
    }, this);

    return (
      <div style={style.component}>
          {searchTagNodes}
          <TagInput {...this.getTagInputProps()}/>
      </div>
    );
  }
  
});

module.exports = TagSearchEditor;