var React = require('react');

var MaterialIcon = require('./MaterialIcon');
var ActionBar = require('./ActionBar');
var Logo = require('./Logo');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Page = R.constant.page;
var Typography = R.typography;
var Value = R.value;

var Util = require('./util/util');

var AppBar = React.createClass({

  propTypes: {
    page: React.PropTypes.string.isRequired,
    onNavigate: React.PropTypes.func,
    onGoHome: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      style: {},
    };
  },

  getIconProps: function() {
    return {
      search: {
        d: Icon.search,
        fill: this.props.page === Page.SEARCH ? Color.white : Color.black,
        fillOpacity: this.props.page === Page.SEARCH ? Color.whitePrimaryOpacity : Color.blackSecondaryOpacity,
        onClick: this.props.onNavigate.bind(null, Page.SEARCH)
      },
      cloud: {
        d: Icon.cloud,
        fill: this.props.page === Page.CLOUD ? Color.white : Color.black,
        fillOpacity: this.props.page === Page.CLOUD ? Color.whitePrimaryOpacity : Color.blackSecondaryOpacity,
        onClick: this.props.onNavigate.bind(null, Page.CLOUD)
      }
    };
  },

  getStyle: function() {
    return {
      appBar: {
        backgroundColor: Color.blue500,
        paddingTop: Dimension.quantum,
        paddingBottom: Dimension.quantum,
        paddingRight: Dimension.quantum,
      },
      logo: {
        float: 'left',
        marginLeft: Dimension.marginMobile,
        marginTop: (Dimension.heightActionBar - Dimension.logoHeight) / 2,
        cursor: 'pointer',
        //put logo above action bar; show pointer-cursor
        position: 'relative',
        zIndex: 1,
      },
      logoIcon: {
        svg: {
          float: 'left',
        }
      },
      logoText: {
        float: 'left',
        fontSize: Typography.fontSizeLarge,
        lineHeight: Typography.lineHeightLarge,
        fontFamily: Typography.logoFontFamily,
        color: Color.whitePrimary,
        marginLeft: Dimension.space,
      }
    };
  },
  
  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);
    var iconProps = this.getIconProps();

    return (
      <div style={style.appBar}>
          <div style={style.logo} onClick={this.props.onGoHome}>
              <Logo cloudColor={Color.whitePrimary} 
                    tagColor={Color.blue500}
                    style={style.logoIcon}/>
              <div style={style.logoText}>{Value.appName}</div>
          </div>
          <ActionBar>
              <MaterialIcon action="Search" {...iconProps.search}/>
              <MaterialIcon action="Cloud" {...iconProps.cloud}/>
          </ActionBar>
      </div>
    );
  },
  
});

module.exports = AppBar;