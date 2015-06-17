var React = require('react');
var ImageIcon = require('./ImageIcon');
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
          float: 'left'
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

  render: function() {
    var style = this.getStyle();

    return (
      <div style={style.folder}>
          <MaterialIcon d={Icon.folder} style={style.leftIcon}/>
          <MaterialIcon d={Icon.moreVert} style={style.rightIcon}/>
          <TextSingle text={this.props.name} style={style.text}/>
      </div>
    );
  }

});

module.exports = Folder;