var React = require('react');
var ActionBar = require('./ActionBar');
var Subheader = require('./Subheader');
var Checkbox = require('./Checkbox');
var MaterialIcon = require('./MaterialIcon');

var Constants = require('./constants/index');
var FALSE = Constants.Ternary.FALSE;
var INDETERMINATE = Constants.Ternary.INDETERMINATE;
var TRUE = Constants.Ternary.TRUE;

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');


//Children of ActionBar should provide a prop called `action`
//The value of `action` is the action's display name in the overflow menu.


var FileActionBar = React.createClass({

  propTypes: {
    numberOfFiles: React.PropTypes.number,
    numberOfFilesSelected: React.PropTypes.number,
    onSelectAll: React.PropTypes.func,
    onUnselectAll: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getStyle: function(checkStatus) {
    return {
      root: {
        position: 'fixed',
        bottom: 0,
        left:0,
        right: 0,
        zIndex: 2,
        backgroundColor: Color.blue500,
        paddingLeft: Dimension.quantum,
        paddingRight: Dimension.quantum,
      },
      checkbox: {
        clearance: {
          float: 'left',
          marginRight: Dimension.quantum,
          zIndex: 3,
        }
      },
      subheader: {
        float: 'left',
        color: checkStatus === FALSE ? Color.blackSecondary : Color.whitePrimary,
      },
      actionBar: {
        actionBar: {
        },
        menu: {
          bottom: Dimension.quantum,
          top: 'auto',
        }
      },
    };
  },

  render: function() {
    var checkStatus;
    if (this.props.numberOfFilesSelected === 0) {
      checkStatus = FALSE;
    }
    else if (this.props.numberOfFilesSelected === this.props.numberOfFiles) {
      checkStatus = TRUE;
    } else {
      checkStatus = INDETERMINATE;
    }
    
    var style = Util.prefix(Util.merge(this.getStyle(checkStatus), this.props.style));
    
    var number, suffix;
    if (checkStatus === FALSE) {
      var number = this.props.numberOfFiles;
      var suffix = "";
    }
    else {
      var number = this.props.numberOfFilesSelected;
      var suffix = " selected";
    }
    var plural = number !== 1;
    var text = number + " file" + (plural ? "s" : "") + suffix;

    var actionBar = null;
    if (this.props.numberOfFilesSelected > 0) {
      actionBar = (
        <ActionBar style={style.actionBar}>
            <MaterialIcon action="Tag"
                          d={Icon.tag}
                          fill={Color.white}
                          fillOpacity={Color.whitePrimaryOpacity}/>
            <MaterialIcon action="Delete"
                          d={Icon.trash}
                          fill={Color.white}
                          fillOpacity={Color.whitePrimaryOpacity}
                          onClick={this.props.onDelete}/>
        </ActionBar>
      );
    }

    return (
      <div style={style.root}>
          <Checkbox checkStatus={checkStatus}
                    onClick={this.handleClick.bind(this,checkStatus)}
                    backgroundColor={Color.white}
                    color={Color.blue500}
                    style={style.checkbox}/>
          <Subheader text={text}
                     style={style.subheader}/>
          {actionBar}
      </div>
    );
  },

  handleClick: function(checkStatus) {
    if (checkStatus === FALSE) {
      this.props.onSelectAll();
    }
    else {
      this.props.onUnselectAll();
    }
  }

});

module.exports = FileActionBar;