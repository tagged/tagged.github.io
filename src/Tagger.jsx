var React = require('react');
var Collapsible = require('./Collapsible');
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
  },

  getStyle: function() {
    return {
      tagger: {
        
      },
      header: {
        backgroundColor: Color.blue500,
        color: Color.whitePrimary,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      fileCount: {
        fontSize: Typography.fontSizeLarge,
        lineHeight: 1.2,
        fontWeight: Typography.fontWeightMedium,
        paddingBottom: this.props.isShowingFiles ? Dimension.quantum : 0,
      },
      file: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: Typography.fontSizeSmall,
        lineHeight: Typography.lineHeightSmall,
      },
      fileName: {
        fontWeight: Typography.fontWeightMedium,
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var files = this.props.files.map(function(file) {
      return (
        <div style={style.file} key={file.id}>
            <span>{file.path.join("/") + "/"}</span><span style={style.fileName}>{file.name}</span>
        </div>
      );
    });

    var plural = files.size === 1 ? "" : "s";

    return (
      <div style={style.tagger}>
          <div style={style.header}>
              <Collapsible isOpen={this.props.isShowingFiles}
                           onToggle={this.props.onToggle}>
                  <div isController={true} style={style.fileCount}>
                      {files.size + " file" + plural}
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