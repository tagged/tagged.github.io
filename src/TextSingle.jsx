var React = require('react');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

var TextSingle = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      text: "",
      style: {},
    };
  },

  getStyle: function() {
    var verticalPadding = (Dimension.heightTextSingle - Typography.lineHeightPx) / 2;

    return {
      root: {
        color: Color.blackPrimary,
        fontWeight: Typography.fontWeightRegular,
        fontSize: Typography.fontSize,
        lineHeight: Typography.lineHeightPx + "px",
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }
    };
  },

  render: function() {
    var {text, style, ...props} = this.props;
    
    style = Util.merge(this.getStyle(), style);

    return (
      <div style={style.root} {...props}>
          {text}
      </div>
    );
  }

});

module.exports = TextSingle;