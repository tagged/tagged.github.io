var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');
//var Velocity = require('../velocity/velocity.js');

var Tag = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string.isRequired,
    isDisabled: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func.isRequired
  },

  getStyle: function() {
    var verticalPadding = (Dimension.heightTag - Typography.lineHeight * Typography.fontSize) / 2;

    return {
      component: {
        display: 'inline-block',
        fontSize: Typography.fontSize,
        lineHeight: Typography.lineHeight,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
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
           onMouseDown={this.handleClick}>
          {this.props.text}
      </div>
    );
  },

  handleClick: function() {
    this.props.handleClick(this.props.text);
  }

});

module.exports = Tag;