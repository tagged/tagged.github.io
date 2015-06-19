var React = require('react/addons');
var R = require('./res/index');
var Dimension = R.dimension;
var Util = require('./util/util');

// Collapsible has two types of children: controller and non-controller.
// A child is a controller if its `isController` prop is set to true.

// Controllers: 
// -are always visible, whether or not Collapsible `isOpen`
// -toggle the Collapsible when clicked

// Non-controllers:
// -are visible only if Collapsible `isOpen`
// -do not respond to clicks

var Collapsible = React.createClass({
  
  propTypes: {
    isOpen: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  getStyle: function() {
    return {
      component: {
        overflow: 'hidden'
      },
      controller: {
        cursor: 'pointer'
      }
    };
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);

    var children = React.Children.map(this.props.children, function(child) {
      if (child.props.isController) {
        return (
          <div style={style.controller}
               onClick={this.props.onToggle}>
              {child}
          </div>
        );
      }
      else if (this.props.isOpen) {
        return <div>{child}</div>;
      }
      else {
        return null;
      }
    }.bind(this));

    return (
      <div style={style.component}>
          {children}
      </div>
    );
  }

});

module.exports = Collapsible;