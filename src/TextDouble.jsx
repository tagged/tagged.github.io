var React = require('react');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

var TextDouble = React.createClass({
  
  propTypes: {
    text: React.PropTypes.array,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      text: ["", ""],
      style: {},
    };
  },

  getStyle: function() {
    return {
      root: {
        color: Color.blackPrimary,
        paddingTop: Dimension.space,
        paddingBottom: Dimension.space,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      first: {
        lineHeight: Typography.lineHeight,
        fontSize: Typography.fontSize,
        fontWeight: Typography.fontWeightRegular,
      },
      second: {
        lineHeight: Typography.lineHeightSmall,
        fontSize: Typography.fontSizeSmall,
        fontWeight: Typography.fontWeightThin,
      },
    };
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);

    return (
      <div style={style.root}>
          <div style={style.first}>
              {this.props.text[0]}
          </div>
          <div style={style.second}>
              {this.props.text[1]}
          </div>
      </div>
    );
  }

});

module.exports = TextDouble;