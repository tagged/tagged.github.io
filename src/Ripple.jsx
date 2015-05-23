var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Velocity = require('../velocity/velocity.js');

var Ripple = React.createClass({

  getStyle: function() {
    return {
      ripple: {
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        borderRadius: '50%',
        backgroundColor: Color.blue500,
        opacity: 0
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.ripple} ref="ripple"></div>
    );
  },

  showRipple: function() {
      var rippleElement = this.refs.ripple.getDOMNode();

      Velocity({
        elements: rippleElement, 
        properties: {
          opacity: .2,
          scaleX: 1,
          scaleY: 1
        },
        options: {duration: 200}
      });
  },

  hideRipple: function() {
    var rippleElement = this.refs.ripple.getDOMNode();
    var RippleComponent = this;

    // Animations in Velocity are queued per element
    Velocity({
      elements: rippleElement,
      properties: {opacity: 0},
      options: {duration: 200}
    });
    Velocity({
      elements: rippleElement,
      properties: {scaleX: 0, scaleY: 0},
      options: {
        complete: function() {
          // Clear animation queue on ripple element
          // to prevent delayed ripples when user taps quickly
          Velocity(rippleElement, "stop", true);
        }
      }
    });
  }

});

module.exports = Ripple;