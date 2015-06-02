var React = require('react/addons');
var MaterialIcon = require('./MaterialIcon');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');

var Checkbox = React.createClass({

  propTypes: {
    isChecked: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func,
    color: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getStyle: function() {
    return {
      component: {
        position: 'relative',
      },
      checkbox: {
        clearance: {
          position: 'absolute',
          top: 0,
          left: 0,
        }
      },
      checkboxOutline: {
      },
    };
  },

  render: function() {
    var style = this.getStyle();

    var initializations = [
      {
        properties: {
          fill: this.props.color,
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

    return (
      <div style={Util.merge(style.component, this.props.style)}
           onClick={this.props.handleCheck}>
          <MaterialIcon d={Icon.checkboxOutline}
                        fill={Color.black}
                        fillOpacity={Color.blackSecondaryOpacity}
                        style={style.checkboxOutline}/>
          <MaterialIcon d={Icon.checkbox}
                        fill={this.props.color}
                        initializations={initializations}
                        animations={animations}
                        style={style.checkbox}/>
      </div>
    );
  }

});

module.exports = Checkbox;