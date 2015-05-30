var React = require('react/addons');
var Color = require('./res/color');
var Util = require('./util/util');
var Dimension = require('./res/dimension');
var Velocity = require('../velocity/velocity.js');

var MaterialIcon = React.createClass({

  propTypes: {
    initializations: React.PropTypes.array,
    animations: React.PropTypes.array,
    d: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    // Provide defaults for optional props
    return {
      initializations: [],
      animations: []      
    };
  },

  render: function() {
    var style = {
      display: 'inline-block',
      height: Dimension.icon,
      width: Dimension.icon,
      userSelect: 'none'
    }
    return (
      <svg viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon}
           style={Util.merge(style, this.props.style)}>
          <path ref="iconPath"
                d={this.props.d}/>
      </svg>
    );
  },

  componentDidMount: function() {
    // Initialize animations

    var iconPath = this.refs.iconPath.getDOMNode();
    var initializations = this.props.initializations;

    for (var i = 0; i < initializations.length; i++) {
      var initialization = initializations[i];
      Velocity(iconPath, initialization.properties, initialization.options);
    }
  },

  componentDidUpdate: function(nextProps) {
    // Animate according to new props

    var iconPath = this.refs.iconPath.getDOMNode();
    var animations = this.props.animations;

    Velocity(iconPath, "finish");

    for (var i = 0; i < animations.length; i++) {
      var animation = animations[i];
      Velocity(iconPath, animation.properties, animation.options);
    }
  }

});

module.exports = MaterialIcon;