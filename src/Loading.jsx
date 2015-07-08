var React = require('react');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Velocity = require('velocity-animate');
var Util = require('./util/util');

//Naming uses a pipe + flow metaphor:
//Pipe is the outer container.
//Flow is the inner moving part.

var Loading = React.createClass({

  propTypes: {
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  getStyle: function() {
    return {
      root: {},
      pipe: {
        position: 'relative',
        width: '100%',
        height: Dimension.heightProgressBar,
        backgroundColor: Color.blackHint,
        overflow: 'hidden',
      },
      flow: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        backgroundColor: Color.blue500,
      }
    }
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);
    
    return (
      <div style={style.root}>
          <div style={style.pipe}>
              <div ref="flow" style={style.flow}></div>
          </div>
      </div>
    );
  },
  
  componentDidMount: function() {
    var flow = React.findDOMNode(this.refs.flow);
    this.reset(flow);
  },
  
  componentWillUnmount: function() {
    var flow = React.findDOMNode(this.refs.flow);
    this.stop(flow);
  },
  
  reset: function(element) {
    Velocity({
      elements: [element],
      properties: {
        left: '-25%',
        right: '100%',
      },
      options: {
        duration: 0
      }
    });
    this.start(element);
  },
    
  start: function(element) {
    Velocity({
      elements: [element],
      properties: {
        left: '100%',
        right: '-25%',
      },
      options: {
        duration: 1260,
        easing: "linear",
        complete: this.reset.bind(this, element)
      }
    });
  },
  
  stop: function(element) {
    Velocity(element, 'stop');
  },

});

module.exports = Loading;