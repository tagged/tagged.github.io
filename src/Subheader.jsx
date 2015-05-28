var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');

var Subheader = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string.isRequired
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
        paddingBottom: verticalPadding,
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.component}>
          {this.props.text}
      </div>
    );
  }

});

module.exports = Subheader;