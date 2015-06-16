var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Typography = R.typography;
var Util = require('./util/util');

var Path = React.createClass({
  
  propTypes: {
    text: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      style: {},
    };
  },

  getStyle: function() {
    var verticalPadding = (Dimension.heightSubheader - Dimension.icon) / 2;

    return {
      path: {
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding
      },
      directory: {
        display: 'inline-block',
        verticalAlign: 'top',
        paddingTop: (Dimension.icon - Typography.lineHeight * Typography.fontSize) / 2,
        paddingBottom: (Dimension.icon - Typography.lineHeight * Typography.fontSize) / 2,
        cursor: 'pointer',
        color: Color.blackSecondary,
        fontSize: Typography.fontSize,
        fontWeight: Typography.fontWeightMedium,
        lineHeight: Typography.lineHeight,
      },
      lastDirectory: {
        cursor: 'auto',
        color: Color.blue500,
      },
      separator: {
        display: 'inline-block',
        verticalAlign: 'top',
        height: Dimension.icon,
        width: Dimension.icon,
        fill: Color.black,
        fillOpacity: Color.blackSecondaryOpacity
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var separator = (
      <svg viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon} style={style.separator}>
          <path d={Icon.chevronRight}/>
      </svg>
    );

    var path = this.props.path.map(function(directory, index) {
      var isLastDirectory = index === this.props.path.size - 1;
      if (isLastDirectory) {
        return (
          <span key={index}>
              <span style={Util.merge(style.directory, style.lastDirectory)}>
                  {directory}
              </span>
          </span>
        );
      }
      else {
        return (
          <span key={index}>
              <span style={style.directory}>
                  {directory}
              </span>
              {separator}
          </span>
        );
      }
    }, this);

    return (
      <div style={style.path}>
          {path}
      </div>
    );
  }

});

module.exports = Path;