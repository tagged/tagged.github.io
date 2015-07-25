var React = require('react');
var ImageIcon = require('./ImageIcon');
var MaterialIcon = require('./MaterialIcon');
var TextSingle = require('./TextSingle');
var TextDouble = require('./TextDouble');
var Menu = require('./Menu');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Image = R.image;
var Providers = R.providers;
var Typography = R.typography;
var Util = require('./util/util');



var CloudFolder = React.createClass({

  propTypes: {
    provider: React.PropTypes.string,
    login: React.PropTypes.string,
    account: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      isMenuShowing: false
    };
  },

  getStyle: function() {
    return {
      folder: {
        position: 'relative',
        paddingLeft: Dimension.quantum,
        paddingRight: Dimension.quantum,
      },
      leftIcon: {
        float: 'left',
        marginTop: Dimension.quantum,
        marginRight: Dimension.quantum,
        cursor: 'pointer',
      },
      rightIcon: {
        clearance: {
          float: 'right',
          marginTop: Dimension.quantum
        }
      },
      text: {
        root: {
          cursor: 'pointer'
        }
      },
      menu: {
        menu: {
          position: 'absolute',
          top: -Dimension.space,
          right: Dimension.marginMobile,
          zIndex: 2,
        },
        item: {
          paddingLeft: Dimension.marginMobile,
          paddingRight: Dimension.marginMobile,
        },
        invisible: {
          zIndex: 1,
        }
      }
    };
  },

  openMenu: function(event) {
    event.stopPropagation();
    this.setState({
      isMenuShowing: true,
    });
  },

  closeMenu: function(event) {
    event.stopPropagation();
    this.setState({
      isMenuShowing: false,
    });
  },

  render: function() {
    var style = this.getStyle();
    
    var menu = null;
    if (this.state.isMenuShowing) {
      menu = (
        <Menu style={style.menu}
              onMenuHide={this.closeMenu}
              onClick={this.stopPropagation}
              onMouseDown={this.stopPropagation}>
            <TextSingle text={"Go to " + this.props.provider}
                        onClick={this.handleGoToProvider}/>
            <TextSingle text="Sign out" onClick={this.handleSignOut}/>
        </Menu>
      );
    }

    //Only enable menu if logged in to this provider
    var menuOpener = null;
    if (this.props.account !== null) {
      menuOpener = (
        <MaterialIcon d={Icon.moreVert}
                      onClick={this.openMenu}
                      style={style.rightIcon}/>
      );
    }

    return (
      <div style={style.folder}
           onClick={this.props.onClick}>
          <ImageIcon {...Image[this.props.provider]} style={style.leftIcon}/>
          {menuOpener}
          <TextDouble text={[this.props.provider, this.props.account || "Sign in"]} 
                      style={style.text}/>
          {menu}
      </div>
    );
  },

  stopPropagation: function(event) {
    event.stopPropagation();
  },
  
  //Do nothing for now
  handleSignOut: function(event) {
    event.stopPropagation();
  },
  
  handleGoToProvider: function(event) {
    this.closeMenu(event);
    window.open(this.props.login, '_blank');
  }
});

module.exports = CloudFolder;