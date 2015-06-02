var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Util = require('./util/util');
var Velocity = require('../velocity/velocity.js');

var MaterialIcon = React.createClass({

  propTypes: {
    initializations: React.PropTypes.array,
    animations: React.PropTypes.array,
    d: React.PropTypes.string.isRequired,
    fill: React.PropTypes.string,
    fillOpacity: React.PropTypes.number,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    // Provide defaults for optional props
    return {
      initializations: [],
      animations: []    
    };
  },

  getStyle: function() {
    return {
      clearance: {
        position: 'relative',
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        cursor: 'pointer'
      },
      svg: {
        display: 'inline-block',
        position: 'absolute',
        top:  (Dimension.touchTarget - Dimension.icon) / 2,
        left: (Dimension.touchTarget - Dimension.icon) / 2,
        height: Dimension.icon,
        width: Dimension.icon,
        userSelect: 'none'
      },
    }
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);
    return (
      <div style={style.clearance}>
          <svg viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon}
               style={style.svg}>
              <path ref="iconPath"
                    d={this.props.d}
                    fill={this.props.fill}
                    fillOpacity={this.props.fillOpacity}/>
          </svg>
      </div>
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