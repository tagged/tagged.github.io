var React = require('react');
var ActionBar = require('./ActionBar');
var Subheader = require('./Subheader');
var Checkbox = require('./Checkbox');
var MaterialIcon = require('./MaterialIcon');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');

var FALSE = R.constant.ternary.FALSE;
var INDETERMINATE = R.constant.ternary.INDETERMINATE;
var TRUE = R.constant.ternary.TRUE;


//Children of ActionBar should provide a prop called `action`
//The value of `action` is the action's display name in the overflow menu.


var FileActionBar = React.createClass({

  propTypes: {
    numberOfFiles: React.PropTypes.number,
    numberOfFilesSelected: React.PropTypes.number,
    onSelectAll: React.PropTypes.func,
    onUnselectAll: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    canUpload: React.PropTypes.bool,
    onFileUpload: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
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
      upload: {
        color: Color.whitePrimary,
        cursor: 'pointer',
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      fileInput: {
        display: 'none',
      }
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
                          fillOpacity={Color.whitePrimaryOpacity}
                          onClick={this.props.onTag}/>
            <MaterialIcon action="Delete"
                          d={Icon.trash}
                          fill={Color.white}
                          fillOpacity={Color.whitePrimaryOpacity}
                          onClick={this.props.onDelete}/>
        </ActionBar>
      );
    }
    else if (this.props.canUpload) {
      actionBar = (
        <ActionBar style={style.actionBar}>
            <input ref="fileInput"
                   type="file" 
                   multiple
                   onChange={this.handleFileInputChange}
                   style={style.fileInput}/>
            <Subheader action="Upload"
                       text="UPLOAD"
                       style={style.upload}
                       onClick={this.handleUploadClick}/>
        </ActionBar>
      );
    }

    return (
      <div style={style.root}>
          <Checkbox checkStatus={checkStatus}
                    outlineColor={Color.black}
                    outlineOpacity={Color.blackSecondaryOpacity}
                    boxColor={Color.white}
                    checkColor={Color.blue500}
                    style={style.checkbox}
                    onClick={this.handleCheckboxClick.bind(this,checkStatus)}/>
          <Subheader text={text}
                     style={style.subheader}/>
          {actionBar}
      </div>
    );
  },

  handleCheckboxClick: function(checkStatus) {
    if (checkStatus === FALSE) {
      this.props.onSelectAll();
    }
    else {
      this.props.onUnselectAll();
    }
  },

  handleUploadClick: function() {
    var fileInput = React.findDOMNode(this.refs.fileInput);
    fileInput.click();
  },

  handleFileInputChange: function(event) {
    this.props.onFileUpload(event);
    var fileInput = React.findDOMNode(this.refs.fileInput);
    fileInput.value = "";
  },

});

module.exports = FileActionBar;