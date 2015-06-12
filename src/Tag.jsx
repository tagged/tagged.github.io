var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

var Tag = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      text: "",
      style: {},
      tabIndex: 1
    };
  },
  
  getStyle: function() {
    var verticalPadding = (Dimension.heightTag - Typography.lineHeight * Typography.fontSize) / 2;

    return {
      tag: {
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
        backgroundColor: Color.blackDivider,
        outlineColor: Color.blackHint,
        cursor: 'pointer'
      }
    };
  },

  render: function() {
    //Extract props, and pass the rest down
    var {text, style, ...tagProps} = this.props;

    var style = Util.merge(this.getStyle(), this.props.style);

    return (
      <div style={style.tag} {...tagProps}>
          {this.props.text}
      </div>
    );
  }  

});

module.exports = Tag;