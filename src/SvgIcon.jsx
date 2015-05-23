var React = require('react');
var Util = require('./util/util');
var Color = require('./res/color');
var Dimension = require('./res/dimension');

var SvgIcon = React.createClass({

  propTypes: {
    style:  React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      style: {}
    }
  },

  getDefaultStyle: function() {
    return {
      display: 'inline-block',
      height: Dimension.icon,
      width: Dimension.icon,
      fill: Color.blackSecondary,
      userSelect: 'none'
    }
  },

  getStyle: function() {
    return Util.merge(this.getDefaultStyle(), this.props.style);
  },

  render: function() {
    return (
      <svg viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon}
           style={this.getStyle()}>
          {this.props.children}
      </svg>
    );
  }

});

module.exports = SvgIcon;