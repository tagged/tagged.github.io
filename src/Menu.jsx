var React = require('react');
var Paper = require('./Paper');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Util = require('./util/util');


var Menu = React.createClass({

  propTypes: {
    hoverColor: React.PropTypes.string,
    style: React.PropTypes.object,
    zDepth: React.PropTypes.number,
  },

  getDefaultProps: function() {
    return {
      hoverColor: Color.blackDivider,
      zDepth: 1,
    }
  },

  getStyle: function() {
    return {
      menu: {
        paddingTop: Dimension.space,
        paddingBottom: Dimension.space,
        borderRadius: Dimension.borderRadius
      },
      item: {
        cursor: 'pointer'
      }
    };
  },

  render: function() {
    var style = this.getStyle();

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
      <Paper zDepth={this.props.zDepth} style={Util.merge(this.props.style, style.menu)}>
          {childNodes}
      </Paper>
    );
  },

  handleMouseEnter: function(childIndex) {
    React.findDOMNode(this.refs["child" + childIndex]).style.backgroundColor = this.props.hoverColor;
  },
  
  handleMouseLeave: function(childIndex) {
    React.findDOMNode(this.refs["child" + childIndex]).style.backgroundColor = 'transparent';
  }
  
});

module.exports = Menu;