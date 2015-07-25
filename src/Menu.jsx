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
        position: 'relative',
        zIndex: 99,
        paddingTop: Dimension.space,
        paddingBottom: Dimension.space,
        borderRadius: Dimension.borderRadius,
        backgroundColor: Color.white,
        boxShadow: Shadow.zDepth[1]
      },
      item: {
        cursor: 'pointer'
      },
      invisible: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 98,
      }
    };
  },

  render: function() {
    var {onMenuHide, hoverColor, style, ...props} = this.props;

    style = Util.merge(this.getStyle(), style);

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
      <div>
          <div style={style.invisible} onMouseDown={onMenuHide}/>
          <div style={style.menu} {...props}>
              {childNodes}
          </div>
      </div>
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