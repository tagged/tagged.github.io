var React = require('react');
var Collapsible = require('./Collapsible');
var ExpandCollapse = require('./ExpandCollapse');
var Tag = require('./Tag');
var TagInput = require('./TagInput');
var Subheader = require('./Subheader');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');



var Tagger = React.createClass({
  
  propTypes: {
    files: React.PropTypes.object,
    isShowingFiles: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    onClose: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      tagger: {
        
      },
      header: {
        backgroundColor: Color.blue500,
        color: Color.whitePrimary,
      },
      closeButton: {
        float: 'right',
        color: Color.whitePrimary,
        fontSize: Typography.fontSizeSmall,
        lineHeight: Typography.lineHeightSmall,
        fontWeight: Typography.fontWeightMedium,
        padding: (Dimension.touchTarget - Typography.lineHeightPx) / 2,
        cursor: 'pointer',
        marginTop: Dimension.quantum
      },
      collapsible: {
        component: {
          padding: Dimension.marginMobile,
        }
      },
      fileCount: {
        float: 'left',
        fontSize: Typography.fontSizeLarge,
        lineHeight: Typography.lineHeightLarge,
        fontWeight: Typography.fontWeightMedium,
        paddingBottom: this.props.isShowingFiles ? Dimension.space : 0,
      },
      file: {
        clear: 'both',//clear earlier float (fileCount)
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: Typography.fontSizeSmall,
        lineHeight: Typography.lineHeightSmall,
      },
      expandCollapse: {
        svg: {
          marginLeft: Dimension.quantum
        }
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var files = this.props.files.map(function(file) {
      return (
        <div style={style.file} key={file.id}>
            {file.name}
        </div>
      );
    });

    var plural = files.size === 1 ? "" : "s";

    return (
      <div style={style.tagger}>
          <div style={style.header}>
              <div style={style.closeButton}
                   onClick={this.props.onClose}>
                  {"DONE"}
              </div>
              <Collapsible isOpen={this.props.isShowingFiles}
                           onToggle={this.props.onToggle}
                           style={style.collapsible}>
                  <div isController={true} style={style.fileCount}>
                      {files.size + " file" + plural}
                      <ExpandCollapse isExpanded={this.props.isShowingFiles}
                                      fill={Color.whitePrimary}
                                      style={style.expandCollapse}/>
                  </div>
                  <div>
                      {files}
                  </div>
              </Collapsible>
          </div>
      </div>
    );
  },

});

module.exports = Tagger;