var React = require('react/addons');
var R = require('./res/index');
var Dimension = R.dimension;
//var Velocity = require('../velocity/velocity.js');

var Collapsible = React.createClass({
  // Clicking on head reveals body

  propTypes: {
    head: React.PropTypes.element.isRequired,
    body: React.PropTypes.element.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    handleToggle: React.PropTypes.func.isRequired,
  },

  getStyle: function() {
    return {
      component: {
        overflow: 'hidden'
      },
      head: {
        cursor: 'pointer'
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.component}>
          <div ref="head"
               onClick={this.props.handleToggle}
               style={style.head}>
              {this.props.icon}
              {this.props.head}
          </div>
          <div ref="body" 
               style={style.body}>
              {this.props.isOpen ? this.props.body : null}
          </div>
      </div>
    );
  }

/*
  componentDidMount: function() {
    var container = this.getDOMNode();
    var head = this.refs.head.getDOMNode();
    var body = this.refs.body.getDOMNode();
    var containerHeight = this.props.isOpen ? 
                          head.offsetHeight + body.offsetHeight : 
                          head.offsetHeight;
    Velocity({
      elements: container,
      properties: {
        height: containerHeight
      },
      options: {
        duration: 0
      }
    });
  },

  componentWillUpdate: function(nextProps) {
    // Animate before render; body will not be rendered
    if (!nextProps.isOpen) {
      var container = this.getDOMNode();
      var head = this.refs.head.getDOMNode();
      Velocity({
        elements: container,
        properties: {
          height: head.offsetHeight
        },
        options: {
          duration: 2000
        }
      });
    }
  },

  componentDidUpdate: function() {
    // Animate after render; body height known
    if (this.props.isOpen) {
      var container = this.getDOMNode();
      var head = this.refs.head.getDOMNode();
      var body = this.refs.body.getDOMNode();
      Velocity({
        elements: container,
        properties: {
          height: head.offsetHeight + body.offsetHeight
        },
        options: {
          duration: 2000
        }
      });
    }
  }
*/

});

module.exports = Collapsible;