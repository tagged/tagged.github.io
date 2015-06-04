var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

var Snackbar = React.createClass({
  
  propTypes: {
    message: React.PropTypes.string,
    action: React.PropTypes.string,
    onAction: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      message: "",
      action: "",
      style: {},
    };
  },

  getStyle: function() {
    return {
      snackbar: {
        display: 'table',
        backgroundColor: "#323232",
        fontSize: Typography.fontSizeSmall,
        lineHeight: Typography.lineHeightSmall,
        margin: '0 auto',
        minWidth: Dimension.snackbar.minWidth,
        maxWidth: Dimension.snackbar.maxWidth,
      },
      message: {
        display: 'table-cell',
        color: Color.whitePrimary,
        fontWeight: Typography.fontWeightRegular,
        paddingTop: Dimension.snackbar.paddingVertical,
        paddingBottom: Dimension.snackbar.paddingVertical,
        paddingLeft: Dimension.snackbar.paddingHorizontal,
        paddingRight: 0,
      },
      action: {
        display: 'table-cell',
        verticalAlign: 'middle',
        paddingLeft: Dimension.snackbar.paddingHorizontal,
        paddingRight: Dimension.snackbar.paddingHorizontal,
        color: Color.blue500,
        fontWeight: Typography.fontWeightMedium,
        cursor: 'pointer',
        userSelect: 'none',
      }
    };
  },

  render: function() {
    var style = Util.prefix(Util.merge(this.getStyle(), this.props.style));
    return (
      <div style={style.snackbar}>
          <div style={style.message}>
              {this.props.message}
          </div>
          <div style={style.action} onClick={this.props.onAction}>
              {this.props.action}
          </div>
      </div>
    );
  }

});

module.exports = Snackbar;