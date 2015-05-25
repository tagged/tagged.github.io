var React = require('react'); 
var SvgIcon = require('./SvgIcon');
var Dimension = require('./res/dimension');
var Velocity = require('../velocity/velocity.js');

var SvgIconExpand = React.createClass({

  render: function() {
    var {fill, ...other} = this.props;
    return (
      <SvgIcon {...other}>
        <path ref="expand"
              fill={fill}
              d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
      </SvgIcon>
    );
  },

  componentDidMount: function() {
    this.initializeAnimation();
  },

  componentWillUpdate: function(nextProps) {
    this.animate(nextProps);
  },

  initializeAnimation: function() {
    var iconPath = this.refs.expand.getDOMNode();

    Velocity({
      elements: iconPath,
      properties: {
        transformOriginX: Dimension.icon / 2,
        transformOriginY: Dimension.icon / 2
      },
      options: {
        duration: 0
      }
    });

  },

  animate: function(nextProps) {
    // Animate according to new props

    var iconPath = this.refs.expand.getDOMNode();

    Velocity(iconPath, "stop", true);

    Velocity({
      elements: iconPath,
      properties: {
        rotateZ: nextProps.isExpanded ? "180deg" : 0
      },
      options: {
        duration: 200,
        easing: "ease"
      }
    });
  }

});

module.exports = SvgIconExpand;