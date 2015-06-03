var React = require('react/addons');
var Constants = require('./constants/index');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;

var Tag = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string.isRequired,
    isDisabled: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired
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
        outlineColor: Color.blue500,
        cursor: this.props.isDisabled ? 'auto' : 'pointer'        
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.component}
           onMouseDown={this.handleMouseDown}
           tabIndex="1"
           onKeyPress={this.handleKeyPress}>
          {this.props.text}
      </div>
    );
  },

  handleMouseDown: function(event) {
    event.preventDefault();
    if (!this.props.isDisabled) {
      this.props.onClick();
    }
  },

  handleKeyPress: function(event) {
    if (!this.props.isDisabled && event.key === 'Enter') {
      this.props.onClick();
    }
  }

});

module.exports = Tag;