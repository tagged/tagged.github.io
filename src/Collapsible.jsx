var React = require('react/addons');
var R = require('./res/index');
var Dimension = R.dimension;

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

});

module.exports = Collapsible;