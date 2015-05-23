var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Velocity = require('../velocity/velocity.js');

var Ripple = React.createClass({

  getInitialState: function(){
    return {
      currentlyRippling: false
    };
  },

  getStyle: function() {
    return {
      ripple: {
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        borderRadius: '50%',
        backgroundColor: Color.blue500,
        opacity: 0
        //transform:  this.props.visible ? 'scale(1)' : 'scale(0)',        
        //Note: transition not working on Chrome mobile
        //transition: this.props.visible ? 'transform 200ms ease-out 0' :
        //            'opacity 400ms ease-out 0, transform 0 ease-out 400ms'
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

    if (!this.state.currentlyRippling) {
      this.setState({currentlyRippling: true});
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

    }
  },

  hideRipple: function() {
    var rippleElement = this.refs.ripple.getDOMNode();
    var RippleComponent = this;

    // Animations in Velocity are queued
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
          RippleComponent.setState({currentlyRippling: false});
        }
      }
    });

  }

});

module.exports = Ripple;