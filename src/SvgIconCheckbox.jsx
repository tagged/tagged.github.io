var React = require('react'); 
var SvgIcon = require('./SvgIcon');
var Dimension = require('./res/dimension');

var SvgIconCheckbox = React.createClass({

  render: function() {
    var {color, ...other} = this.props;
    return (
      <SvgIcon {...other}>
        <path ref="checkbox"
              fill={color}
              d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </SvgIcon>
    );
  },

  componentDidMount: function() {
    // Initialize animation state

    // Fake out Velocity: set initial scale to 1, 
    // then set true initial scale.
    // For reason, see 'Transforms' section of velocity.js and
    // http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962

    var checkboxElement = this.refs.checkbox.getDOMNode();

    //Fake out (see comments)
    Velocity({
      elements: checkboxElement,
      properties: {
        scale: 1,
      },
      options: {
        duration: 0
      }
    });

    Velocity({
      elements: checkboxElement,
      properties: {
        fillOpacity: this.props.isChecked ? 1 : 0,
        scale: this.props.isChecked ? 1 : 0,
        transformOriginX: Dimension.icon / 2,
        transformOriginY: Dimension.icon / 2
      },
      options: {
        duration: 0
      }
    });
  },

  componentDidUpdate: function() {
    // Animate according to updated props

    var checkboxElement = this.refs.checkbox.getDOMNode();

    Velocity({
      elements: checkboxElement,
      properties: {
        fillOpacity: this.props.isChecked ? 1 : 0,
        scale: this.props.isChecked ? 1 : 0
      },
      options: {
        duration: 200, 
        easing: "ease-out"
      }
    });    
  },

  stopAnimation: function() {
    var checkElement = this.refs.checkbox.getDOMNode();
    Velocity(checkElement, "stop", true);
  }

});

module.exports = SvgIconCheckbox;