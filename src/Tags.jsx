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
//Enable the overflow tag by setting `withOverflow` prop
//to true.


var Tags = React.createClass({
  
  contextTypes: {
    preventMouseDown: React.PropTypes.func,
  },
  
  propTypes: {
    tags: React.PropTypes.instanceOf(Immutable.OrderedSet),
    specialTags: React.PropTypes.instanceOf(Immutable.Set),
    onTagClick: React.PropTypes.func,
    onSpecialTagClick: React.PropTypes.func,
    style: React.PropTypes.object,

    withOverflow: React.PropTypes.bool,

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
      specialTags: Immutable.Set(),
      onSpecialTagClick: Util.noop,
      withInput: false,
      withOverflow: false,
      style: {},
    };
  },

  getInitialState: function() {
    return {
      //initially all tags are visible
      //if withOverflow is true, can be less
      tagsVisible: this.props.tags.size,
      
      //true until componentDidMount is called
      isMounting: true,
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
      tags: {
        whiteSpace: (this.props.withOverflow && this.state.tagsVisible < this.props.tags.size) ? 'nowrap' : 'normal'
      },
      tag: {
        tag: {
          backgroundColor: Color.blue100,
          color: Color.blue900,
          cursor: 'pointer',
          outlineColor: Color.blue500,
        }
      },
      specialTag: {
        tag: {
          backgroundColor: Color.blue500,
          color: Color.whitePrimary,
          cursor: 'pointer',
          outlineColor: Color.blue900,
        }
      },
      overflowTag: {
        tag: {
          backgroundColor: 'transparent',
          color: Color.blackHint,
          cursor: 'pointer',
          outlineColor: Color.blackSecondary,
          marginRight: 0,
        }
      },
      tagInput: {
        input: {
          borderColor: Color.blackSecondary,
          outlineColor: Color.blue500 //focused input
        }
      }
    };
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);


    var tags = this.props.tags.toList().map(function(tag, tagIndex) {
      
      var isSpecial = this.props.specialTags.includes(tag);

      var onClick = function() {
        isSpecial ? this.props.onSpecialTagClick(tag) : this.props.onTagClick(tag);
      }.bind(this);
      
      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          isSpecial ? this.props.onSpecialTagClick(tag) : this.props.onTagClick(tag);
        }
      }.bind(this);

      return (
        <Tag ref={"tag" + tagIndex}
             text={tag}
             style={isSpecial ? style.specialTag : style.tag}
             onClick={onClick}
             onMouseDown={this.context.preventMouseDown}
             onKeyDown={onKeyDown}
             key={tag}/>
      );

    }, this);

    
    //If overflowing, all tags might not be visible
    if (this.props.withOverflow) {
      tags = tags.slice(0, this.state.tagsVisible);
    }
    
    
    var overflowTag = null;

    //Normally, show overflow tag when less than all tags are visible
    //Make an exception during initial mount; need to render overflow tag
    //in order to calculate overflow
    var showOverflowTag = this.props.withOverflow &&
    (this.state.tagsVisible < this.props.tags.size || this.state.isMounting);

    if (showOverflowTag) {
      
      var onClick = function() {
        //Show all tags
        this.setState({
          tagsVisible: this.props.tags.size
        });
      }.bind(this);
      
      var onKeyDown = function(event) {
        if (event.key === 'Enter') {
          onClick();
        }
      }.bind(this);
      
      var tagCount = this.props.tags.size;
      
      overflowTag = (
        <Tag ref='overflowTag'
             text={'Show all (' + tagCount + ')'}
             style={style.overflowTag}
             onClick={onClick}
             onMouseDown={this.context.preventMouseDown}
             onKeyDown={onKeyDown}
             key={'overflow'}/>
      );
    }
    
    
    var tagInput = null;
    if (this.props.withInput) {
      
      var onKeyDown = function(event) {
        if (
          //pressed enter
          event.key === 'Enter'
          //value not empty string
          && this.props.value.length > 0
          //value is not already a tag
          && !this.props.tags.includes(this.props.value)
        ) {
          this.props.onSubmit(this.props.value);
        }
      }.bind(this);

      tagInput = (
        <TagInput ref="tagInput"
                  value={this.props.value}
                  style={style.tagInput}
                  placeholder={this.props.placeholder}
                  onChange={this.props.onValueChange}
                  onMouseDown={this.context.preventMouseDown}
                  onKeyDown={onKeyDown}
                  onFocus={this.props.onFocus}/>
      );
    }
    
    
    return (
      <div style={style.tags}>
          {tags}
          {tagInput}
          {overflowTag}
      </div>
    );
  },
  
  componentDidMount: function() {
    this.setState({isMounting: false});
    
    if (!this.props.withOverflow) {
      return;
    }
    
    var tagsVisible = this.calculateOverflow();
    if (tagsVisible !== this.state.tagsVisible) {
      this.setState({
        tagsVisible: tagsVisible,
      });
    }
  },

  //Return the number of tags that can be displayed in one line
  //while leaving space for overflow tag.
  calculateOverflow: function() {
    var tagsWidth = Util.getDOMNodeComputedStyle(this, 'width');
    var overflowTagWidth = Util.getDOMNodeComputedStyle(this.refs.overflowTag, 'width') + 2 * Dimension.space;

    var currentTag = 0;
    var widthBeforeCurrentTag = 0;
    var currentTagWidth;
    while (currentTag < this.props.tags.size) {
      
      currentTagWidth = Util.getDOMNodeComputedStyle(this.refs['tag' + currentTag], 'width') + 3 * Dimension.space;
      
      //Make an exception for the last tag, if it fits
      if (currentTag === this.props.tags.size - 1) {
        if (widthBeforeCurrentTag + currentTagWidth < tagsWidth) {
          currentTag ++;
          break;
        }
      }
      
      //Stop if currentTag would overflow tags
      if (widthBeforeCurrentTag + currentTagWidth + overflowTagWidth > tagsWidth) {
        break;
      }
      
      currentTag ++;
      widthBeforeCurrentTag += currentTagWidth;
      
    }
    return currentTag;
  },

});

module.exports = Tags;