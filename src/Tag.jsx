var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
//var Velocity = require('../velocity/velocity.js');

var Tag = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string.isRequired,
    isDisabled: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func.isRequired
  },

  getStyle: function() {
    return {
      component: {
        display: 'inline-block',
        height: '32px',
        lineHeight: '32px',
        paddingLeft: Dimension.space,
        paddingRight: Dimension.space,
        marginRight: Dimension.space,
        borderRadius: '2px',
        backgroundColor: this.props.isDisabled ? Color.blackDivider : Color.blue100,
        cursor: this.props.isDisabled ? 'auto' : 'pointer'        
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.component}
           onClick={this.handleClick}>
          {this.props.text}
      </div>
    );
  }

});

module.exports = Tag;