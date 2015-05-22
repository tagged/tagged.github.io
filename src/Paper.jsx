var React = require('react/addons');
var Util = require('./util/util');
var Color = require('./res/color');
var Shadow = require('./res/shadow');
var Transition = require('./res/transition');

var Paper = React.createClass({

  propTypes: {
    style:  React.PropTypes.object,
    zDepth: React.PropTypes.oneOf([0,1,2,3,4,5])
  },

  getDefaultProps: function() {
    return {
      style: {},
      zDepth: 1
    }
  },

  getDefaultStyle: function() {
    return {
      backgroundColor: Color.white,
      color: Color.blackPrimary,
      boxSizing: 'border-box',
      boxShadow: Shadow.zDepth[this.props.zDepth],
      transition: Transition.easeOut,
      WebkitTapHighlightColor: 'rgba(0,0,0,0)'
    }
  },

  getStyle: function() {
    return Util.merge(this.getDefaultStyle(), this.props.style);
  },

  render: function() {
    return (
      <div style={this.getStyle()}>
          {this.props.children}
      </div>
    );
  }

});

module.exports = Paper;