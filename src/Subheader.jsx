var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');
var Util = require('./util/util');

var Subheader = React.createClass({
  
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
    var verticalPadding = (Dimension.heightSubheader - Typography.lineHeightSmall * Typography.fontSizeSmall) / 2;

    return {
      component: {
        color: Color.blackSecondary,
        fontWeight: Typography.fontWeightMedium,
        fontSize: Typography.fontSizeSmall,
        lineHeight: Typography.lineHeightSmall,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={Util.merge(style.component, this.props.style)}>
          {this.props.text}
      </div>
    );
  }

});

module.exports = Subheader;