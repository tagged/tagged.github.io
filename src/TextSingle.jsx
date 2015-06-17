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
    var style = Util.merge(this.getStyle(), this.props.style);

    return (
      <div style={style.root}>
          {this.props.text}
      </div>
    );
  }

});

module.exports = TextSingle;