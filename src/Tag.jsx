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
        fontSize: 16,
        lineHeight: 1.25,
        paddingTop: Dimension.space,
        paddingBottom: Dimension.space,
        paddingLeft: Dimension.space,
        paddingRight: Dimension.space,
        marginRight: Dimension.space,
        marginBottom: Dimension.space,
        borderRadius: Dimension.borderRadius,
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