var React = require('react');
var ImageIcon = require('./ImageIcon');
var MaterialIcon = require('./MaterialIcon');
var TextDouble = require('./TextDouble');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Image = R.image;
var Typography = R.typography;
var Util = require('./util/util');



var CloudFolder = React.createClass({

  propTypes: {
    provider: React.PropTypes.string,
    account: React.PropTypes.string
  },

  getStyle: function() {
    return {
      folder: {
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
      }
    };
  },

  openMenu: function(event) {
    event.stopPropagation();
  },

  render: function() {
    var style = this.getStyle();

    return (
      <div style={style.folder}
           onClick={this.props.onClick}>
          <ImageIcon {...Image[this.props.provider]} style={style.leftIcon}/>
          <MaterialIcon d={Icon.moreVert}
                        onClick={this.openMenu}
                        style={style.rightIcon}/>
          <TextDouble text={[this.props.provider, this.props.account]} 
                      style={style.text}/>
      </div>
    );
  }

});

module.exports = CloudFolder;