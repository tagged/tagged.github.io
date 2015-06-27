var React = require('react/addons');
var R = require('./res/index');
var Animation = R.animation;
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');
var Velocity = require('../velocity/velocity.js');

var Snackbar = React.createClass({
  
  propTypes: {
    message: React.PropTypes.string,
    action: React.PropTypes.string,
    onCancel: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      message: "",
      action: "",
      style: {},
    };
  },

  getStyle: function() {
    return {
      snackbar: {
        display: 'table',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: "#323232",
        fontSize: Typography.fontSizeSmall,
        lineHeight: Typography.lineHeightSmall,
        minWidth: Dimension.snackbar.minWidth,
        //maxWidth: Dimension.snackbar.maxWidth,
        zIndex: 4,
      },
      message: {
        display: 'table-cell',
        color: Color.whitePrimary,
        fontWeight: Typography.fontWeightRegular,
        paddingTop: Dimension.snackbar.paddingVertical,
        paddingBottom: Dimension.snackbar.paddingVertical,
        paddingLeft: Dimension.snackbar.paddingHorizontal,
        paddingRight: 0,
        //Break between words, then within words if needed
        wordWrap: 'break-word',
        wordBreak: 'break-all',
      },
      action: {
        display: 'table-cell',
        verticalAlign: 'middle',
        width: 1,//table-cell will expand to fit content
        paddingLeft: Dimension.snackbar.paddingHorizontal,
        paddingRight: Dimension.snackbar.paddingHorizontal,
        color: Color.blue500,
        fontWeight: Typography.fontWeightMedium,
        cursor: 'pointer',
        userSelect: 'none',
      }
    };
  },

  render: function() {
    var style = Util.prefix(Util.merge(this.getStyle(), this.props.style));
    return (
      <div style={style.snackbar}>
          <div style={style.message} ref="message">
              {this.props.message}
          </div>
          <div style={style.action} ref="action" onClick={this.props.onCancel}>
              {this.props.action}
          </div>
      </div>
    );
  },

  componentWillEnter: function(callback) {
    var snackbar = React.findDOMNode(this);
    var message = React.findDOMNode(this.refs.message);
    var action = React.findDOMNode(this.refs.action);
    var snackbarHeight = Util.getDOMNodeComputedStyle(this, 'height');
    //Initialize
    Velocity({
      elements: snackbar,
      properties: {bottom: -snackbarHeight},
      options: {duration: 0}
    });
    Velocity({
      elements: [message, action],
      properties: {opacity: 0},
      options: {duration: 0}
    });
    //Animate
    Velocity({
      elements: snackbar,
      properties: {bottom: 0},
      options: {
        duration: Animation.snackbar.enter.duration,
        easing: Animation.snackbar.enter.easing,
      }
    });
    Velocity({
      elements: [message, action],
      properties: {opacity: 1},
      options: {
        delay: Animation.snackbar.enter.textDelay,
        duration: Animation.snackbar.enter.textDuration,
        easing: Animation.snackbar.enter.easing,
        queue: false,
        complete: callback
      }
    });
  },
  
  componentWillLeave: function(callback) {
    var snackbar = React.findDOMNode(this);
    var message = React.findDOMNode(this.refs.message);
    var action = React.findDOMNode(this.refs.action);
    var snackbarHeight = Util.getDOMNodeComputedStyle(this, 'height');
    Velocity({
      elements: [message, action],
      properties: {opacity: 0},
      options: {
        duration: Animation.snackbar.leave.duration,
      }
    });
    Velocity({
      elements: snackbar,
      properties: {bottom: -snackbarHeight},
      options: {
        duration: Animation.snackbar.leave.duration, 
        easing: Animation.snackbar.leave.easing,
        queue: false, 
        complete: callback
      } 
    });
  }

});

module.exports = Snackbar;