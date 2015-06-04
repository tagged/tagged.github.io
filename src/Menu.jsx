var React = require('react');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Shadow = R.shadow;
var Util = require('./util/util');


var Menu = React.createClass({

  propTypes: {
    onMenuHide: React.PropTypes.func,
    hoverColor: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      hoverColor: Color.blackDivider,
    }
  },

  getStyle: function() {
    return {
      menu: {
        paddingTop: Dimension.space,
        paddingBottom: Dimension.space,
        borderRadius: Dimension.borderRadius,
        boxShadow: Shadow.zDepth[1]
      },
      item: {
        cursor: 'pointer'
      }
    };
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);

    var childNodes = React.Children.map(this.props.children, function(child, childIndex) {
      return (
        <div ref={"child" + childIndex}
             onMouseEnter={this.handleMouseEnter.bind(this, childIndex)}
             onMouseLeave={this.handleMouseLeave.bind(this, childIndex)}
             style={style.item}>
            {child}
        </div>
      );
    }, this);

    return (
      <div style={style.menu}>
          {childNodes}
      </div>
    );
  },

  componentDidMount: function() {
    document.addEventListener("mousedown", this.props.onMenuHide);
  },

  componentWillUnmount: function() {
    document.removeEventListener("mousedown", this.props.onMenuHide);
  },

  handleMouseEnter: function(childIndex) {
    React.findDOMNode(this.refs["child" + childIndex]).style.backgroundColor = this.props.hoverColor;
  },
  
  handleMouseLeave: function(childIndex) {
    React.findDOMNode(this.refs["child" + childIndex]).style.backgroundColor = 'transparent';
  }
  
});

module.exports = Menu;