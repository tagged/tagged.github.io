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
      text: {
        root: {
          cursor: 'pointer'
        }
      }
    };
  },

  openMenu: function(event) {
    event.stopPropagation();
  },

  render: function() {
    var style = this.getStyle();

    return (
      <div style={style.folder} onClick={this.props.onClick}>
          <MaterialIcon d={Icon.folder} style={style.leftIcon}/>
          <MaterialIcon d={Icon.moreVert} 
                        onClick={this.openMenu}
                        style={style.rightIcon}/>
          <TextSingle text={this.props.name} style={style.text}/>
      </div>
    );
  }

});

module.exports = Folder;