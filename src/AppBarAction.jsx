var React = require('react/addons');
var Color = require('./res/color');
var Spacing = require('./res/spacing');

var AppBarAction = React.createClass({

  getStyle: function() {
    return {
      display: 'inline-block',
      boxSizing: 'border-box',
      height: Spacing.touchTarget,
      width: Spacing.touchTarget,
      padding: (Spacing.touchTarget - Spacing.heightIcon) / 2,
      cursor: 'pointer'
    }
  },

  render: function() {
    return (
      <li style={this.getStyle()} onClick={this.props.handleAction}>
          {this.props.children}
      </li>
    );
  }

});

module.exports = AppBarAction;