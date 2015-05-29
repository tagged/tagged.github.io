var React = require('react/addons');
var Tag = require('./Tag');
var Subheader = require('./Subheader');
var Dimension = require('./res/dimension');
var Util = require('./util/util');

var TagSearchSuggestions = React.createClass({

  propTypes: {
    suggestedTags: React.PropTypes.array, //array of Tag objects
    title: React.PropTypes.string,
    addSearchTag: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      tags: []
    };
  },
  
  getStyle: function() {    
    return {
      component: {},
      tagContainer: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
        paddingTop: Dimension.space
      }
    };
  },

  render: function() {
    var style = this.getStyle();

    var suggestedTags = this.props.suggestedTags.map(function(tag) {
      return <Tag text={tag.text} 
                  isDisabled={tag.isDisabled}
                  handleClick={this.props.addSearchTag}
                  key={tag.text}/>
    }, this);

    return (
      <div style={style.component}>
          <Subheader text={this.props.title}/>
          <div style={style.tagContainer}>
              {suggestedTags}
          </div>
      </div>
    );
  }
  
});

module.exports = TagSearchSuggestions;