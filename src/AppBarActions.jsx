var React = require('react/addons');
var Util = require('./util/util');
var Color = require('./res/color');
var Spacing = require('./res/spacing');

var AppBarActions = React.createClass({

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
      float: 'right',
      marginRight: '4px',
      paddingTop: (Spacing.heightAppBarMobile - Spacing.touchTarget) / 2
    }
  },

  getStyle: function() {
    return Util.merge(this.getDefaultStyle(), this.props.style);
  },

  render: function() {
/*
    var childrenStyle = {
      display: 'inline-block',
      boxSizing: 'border-box',
      height: Spacing.touchTarget,
      width: Spacing.touchTarget,
      padding: (Spacing.touchTarget - Spacing.heightIcon) / 2,
      cursor: 'pointer'
    };

    var children = React.Children.map(this.props.children,
      function(child) {
        return (
          <li style={childrenStyle}>
              {child}
          </li>
        );
      }
    );
*/
    return (
      <ul style={this.getStyle()}>
          {this.props.children}
      </ul>
    );

  }

});

module.exports = AppBarActions;