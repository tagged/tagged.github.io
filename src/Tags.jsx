var React = require('react/addons');
var Tag = require('./Tag');
var TagInput = require('./TagInput');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');
var Immutable = require('immutable');


//Tags contains Tag components and optionally a TagInput.
//Enable TagInput by setting the `withInput` prop to true.


var Tags = React.createClass({
  
  propTypes: {
    tags: React.PropTypes.instanceOf(Immutable.OrderedSet),
    onTagClick: React.PropTypes.func,
    style: React.PropTypes.object,

    withInput: React.PropTypes.bool,

    //The following props are required if withInput is true
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onFocus: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      style: {},
    };
  },
  
  getInputNode: function() {
    return React.findDOMNode(this.refs.tagInput.refs.input);
  },

  getInputValue: function() {
    return this.refs.tagInput.getValue();
  },
  
  getStyle: function() {
    return {
      tags: {},
      tag: {
        tag: {
          backgroundColor: Color.blue100,
          cursor: 'pointer',
          outlineColor: Color.blue500
        }
      },
      tagInput: {
        input: {
          borderColor: Color.blackSecondary,
          outlineColor: Color.blue500 //focused input
        }
      },
      
    };
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);



    var tags = this.props.tags.map(function(tag) {

      var onMouseDown = function(event) {
        //Don't hide suggestions yet
        event.stopPropagation();
      };
      
      var onClick = function(event) {
        this.props.onTagClick(tag);
      }.bind(this);

      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          this.props.onTagClick(tag);
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
    
    
    
    var tagInput = null;
    if (this.props.withInput) {
      
      var onMouseDown = function(event) {
        //Don't hide suggestions yet
        event.stopPropagation();
      };

      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          if (this.props.value.length > 0) {
            this.props.onSubmit();
          }
        }
      }.bind(this);

      tagInput = (
        <TagInput ref="tagInput"
                  value={this.props.value}
                  style={style.tagInput}
                  placeholder={this.props.placeholder}
                  onChange={this.props.onValueChange}
                  onMouseDown={onMouseDown}
                  onKeyDown={onKeyDown}
                  onFocus={this.props.onFocus}/>
      );
    }
    
    
    
    return (
      <div style={style.tags}>
          {tags}
          {tagInput}
      </div>
    );
  }  

});

module.exports = Tags;