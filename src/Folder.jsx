var React = require('react');
var MaterialIcon = require('./MaterialIcon');
var TextSingle = require('./TextSingle');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Typography = R.typography;
var Util = require('./util/util');



var Folder = React.createClass({

  propTypes: {
    name: React.PropTypes.string
  },

  getStyle: function() {
    return {
      folder: {
        paddingLeft: Dimension.quantum,
        paddingRight: Dimension.quantum,
      },
      leftIcon: {
        clearance: {
          float: 'left',
          marginRight: Dimension.quantum,
        }
      },
      rightIcon: {
        clearance: {
          float: 'right'
        }
      },
      folderNameWrapper: {
        overflow: 'hidden',//clear left icon
      },
      folderName: {
        root: {
          float: 'left',
          cursor: 'pointer',
          whiteSpace: 'normal',
        }
      }
    };
  },

  openMenu: function(event) {
    event.stopPropagation();
  },

  render: function() {
    var style = this.getStyle();

    var menuOpener = null;
    //Disable menu for now
    if (false) {
      menuOpener = (
        <MaterialIcon d={Icon.moreVert} 
                      onClick={this.openMenu}
                      style={style.rightIcon}/>
      );
    }
    
    return (
      <div style={style.folder}>
          <MaterialIcon d={Icon.folder}
                        onClick={this.props.onClick}
                        style={style.leftIcon}/>
          {menuOpener}
          <div style={style.folderNameWrapper}>
              <TextSingle text={this.props.name}
                          onClick={this.props.onClick}
                          style={style.folderName}/>
          </div>
      </div>
    );
  }

});

module.exports = Folder;