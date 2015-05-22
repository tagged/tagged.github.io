var React = require('react/addons');
var Paper = require('./Paper');
var Util = require('./util/util');
var Color = require('./res/color');
var Spacing = require('./res/spacing');

var AppBar = React.createClass({

  propTypes: {
    style:  React.PropTypes.object,
    zDepth: React.PropTypes.oneOf([0,1,2,3,4,5])
  },

  getDefaultProps: function() {
    return {
      style: {},
      zDepth: 0
    }
  },

  getDefaultStyle: function() {
    return {
      backgroundColor: Color.blue500,
      color: Color.white,
      height: Spacing.heightAppBarMobile,
      overflow: 'hidden'
    }
  },

  getStyle: function() {
    return Util.merge(this.getDefaultStyle(), this.props.style);
  },

  render: function() {
    return (
      <Paper style={this.getStyle()} zDepth={this.props.zDepth}>
          {this.props.children}
      </Paper>
    );
  }

});

module.exports = AppBar;