var React = require('react/addons'); 
var Dimension = require('./res/dimension');
var MaterialIcon = require('./MaterialIcon');

var MaterialIconCheckbox = React.createClass({
  getMaterialIconProps: function() {
    var initializations = [
      {
        properties: {
          fill: this.props.fill,
          fillOpacity: this.props.isChecked ? 1 : 0,
          scale: this.props.isChecked ? 1 : 0,
          transformOriginX: Dimension.icon / 2,
          transformOriginY: Dimension.icon / 2
        },
        options: {
          duration: 0
        }
      },

      // Fake out Velocity: set initial scale to 1, 
      // then set true initial scale.
      // For reason, see 'Transforms' section of velocity.js and
      // http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962
      // This cannot precede the previous animation;
      // it would cause scale to flash from 1 to 0
      {
        properties: {
          scale: 1
        },
        options: {
          duration: 0
        }
      },

      {
        properties: {
          scale: this.props.isChecked ? 1 : 0
        },
        options: {
          duration: 0
        }
      }
    ];

    var animations = [
      {
        properties: {
          fillOpacity: this.props.isChecked ? 1 : 0,
          scale: this.props.isChecked ? 1 : 0
        },
        options: {
          duration: 350,
          easing: "ease"
        }
      }
    ];

    var d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";

    return {
      initializations: initializations,
      animations: animations,
      style: this.props.style,
      d: d
    };
  },

  render: function() {
    var props = this.getMaterialIconProps();
    return (
      <MaterialIcon initializations={props.initializations}
                    animations={props.animations}
                    style={props.style}
                    d={props.d}/>
    );
  }

});

module.exports = MaterialIconCheckbox;