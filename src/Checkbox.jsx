var React = require('react/addons');
var MaterialIcon = require('./MaterialIcon');

var Constants = require('./constants/index');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');

var Checkbox = React.createClass({

  propTypes: {
    checkState: React.PropTypes.oneOf([
      Constants.Ternary.FALSE,
      Constants.Ternary.INDETERMINATE,
      Constants.Ternary.TRUE,
    ]),
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
      checkboxPartial: {
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

  getCheckboxAnimation: function() {

    var initializations = [
      {
        properties: {
          fill: this.props.color,
          fillOpacity: this.props.checkState === Constants.Ternary.TRUE ? 1 : 0,
          scale: this.props.checkState === Constants.Ternary.TRUE ? 1 : 0,
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
          scale: this.props.checkState === Constants.Ternary.TRUE ? 1 : 0
        },
        options: {
          duration: 0
        }
      }
    ];

    var animations = [
      {
        properties: {
          fillOpacity: this.props.checkState === Constants.Ternary.TRUE ? 1 : 0,
          scale: this.props.checkState === Constants.Ternary.TRUE ? 1 : 0
        },
        options: {
          duration: 350,
          easing: "ease"
        }
      }
    ];

    return {
      initializations: initializations,
      animations: animations
    };
    
  },
  
    getCheckboxPartialAnimation: function() {

      var initializations = [
        {
          properties: {
            fill: this.props.color,
            fillOpacity: this.props.checkState === Constants.Ternary.INDETERMINATE ? 1 : 0,
            scale: this.props.checkState === Constants.Ternary.INDETERMINATE ? 1 : 0,
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
            scale: this.props.checkState === Constants.Ternary.INDETERMINATE ? 1 : 0
          },
          options: {
            duration: 0
          }
        }
      ];

      var animations = [
        {
          properties: {
            fillOpacity: this.props.checkState === Constants.Ternary.INDETERMINATE ? 1 : 0,
            scale: this.props.checkState === Constants.Ternary.INDETERMINATE ? 1 : 0
          },
          options: {
            duration: 350,
            easing: "ease"
          }
        }
      ];

      return {
        initializations: initializations,
        animations: animations
      };
      
  },
  
  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);
    var checkbox = this.getCheckboxAnimation();
    var checkboxPartial = this.getCheckboxPartialAnimation();

    return (
      <div style={style.component}
           onClick={this.props.handleCheck}>
          <MaterialIcon d={Icon.checkboxOutline}
                        fill={Color.black}
                        fillOpacity={Color.blackSecondaryOpacity}
                        style={style.checkboxOutline}/>
          <MaterialIcon d={Icon.checkboxPartial}
                        initializations={checkboxPartial.initializations}
                        animations={checkboxPartial.animations}
                        style={style.checkboxPartial}/>
          <MaterialIcon d={Icon.checkbox}
                        initializations={checkbox.initializations}
                        animations={checkbox.animations}
                        style={style.checkbox}/>
      </div>
    );
  }

});

module.exports = Checkbox;