var React = require('react');
var Collapsible = require('./Collapsible');
var ExpandCollapse = require('./ExpandCollapse');
var Tags = require('./Tags');
var Subheader = require('./Subheader');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

var Immutable = require('immutable');



var Tagger = React.createClass({
  
  propTypes: {
    files: React.PropTypes.object,
    isShowingFiles: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    onClose: React.PropTypes.func,

    taggerValue: React.PropTypes.string,
    onTaggerValueChange: React.PropTypes.func,
    suggestions: React.PropTypes.object,
    onTaggerFocus: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      tagger: {
        
      },
      header: {
        backgroundColor: Color.blue500,
        color: Color.whitePrimary,
      },
      close: {
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
      },
      body: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
        paddingTop: Dimension.space,
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

    //Count each tag
    var tags = {};
    this.props.files.forEach(function(file) {
      for (var i=0; i < file.tags.length; i++) {
        var tag = file.tags[i];
        if (!tags.hasOwnProperty(tag)) {
          tags[tag] = 0;
        }
        tags[tag]++;
      }
    });

    //If a tag's count is equal to the number of files,
    //then that tag must belong to all files. Otherwise
    //that tag is only on some files.
    
    var tagsOnAllFiles = [];
    var tagsOnSomeFiles = [];
    for (var tag in tags) {
      var count = tags[tag];
      if (count === files.size) {
        tagsOnAllFiles.push(tag);
      }
      else {
        tagsOnSomeFiles.push(tag);
      }
    }
    
    tagsOnAllFiles = Immutable.OrderedSet(tagsOnAllFiles).sort();
    tagsOnSomeFiles = Immutable.OrderedSet(tagsOnSomeFiles).sort();

    var tagsTitle;
    if (files.size === 1) {
      tagsTitle = "Tags";
    }
    else if (files.size === 2) {
      tagsTitle = "Tags on both files";
    }
    else if (files.size > 2) {
      tagsTitle = "Tags on all files";
    }

    var suggestions;
    //No value. Show:
    //-tags on some files (if more than one file)
    //-recent tags
    //-all tags
    if (this.props.taggerValue.length === 0) {
      if (files.size > 1) {
        var title;
        if (files.size === 2) {
          title = "Tags on one file";
        }
        else if (files.size > 2) {
          title = "Tags on some files";
        }
        suggestions = (
          <div>
              <Subheader text={title}/>
              <Tags ref="tagsOnSomeFiles"
                    tags={tagsOnSomeFiles}
                    onTagClick={Util.noop}/>
          </div>
        );
      }
    }
    //Show tags starting with value
    //If no tag starting with value, offer to create it
    else {
      var title;
      if (this.props.suggestions.size > 0) {
        title = '"' + this.props.taggerValue + '"' + " tags";
      }
      else {
        title = "Create new tag " + '"' + this.props.taggerValue + '"';
      }
      suggestions = (
        <div>
            <Subheader text={title}/>
            <Tags tags={this.props.suggestions}
                  disabledTags={tagsOnAllFiles}
                  onTagClick={Util.noop}/>
        </div>
      );
    }



    return (
      <div style={style.tagger}>
          <div style={style.header}>
              <div style={style.close} onClick={this.props.onClose}>DONE</div>
              <Collapsible isOpen={this.props.isShowingFiles}
                           onToggle={this.props.onToggle}
                           style={style.collapsible}>
                  <div isController={true} style={style.fileCount}>
                      {files.size + " file" + (files.size === 1 ? "" : "s")}
                      <ExpandCollapse isExpanded={this.props.isShowingFiles}
                                      fill={Color.whitePrimary}
                                      style={style.expandCollapse}/>
                  </div>
                  {files}
              </Collapsible>
          </div>
          <div style={style.body}>
              <Subheader text={tagsTitle}/>
              <Tags ref="tagsOnAllFiles"
                    tags={tagsOnAllFiles}
                    onTagClick={Util.noop}
                    withInput={true}
                    value={this.props.taggerValue}
                    onValueChange={this.props.onTaggerValueChange}
                    placeholder={"Add tag"}
                    onSubmit={Util.noop}
                    onFocus={this.props.onTaggerFocus}/>
              {suggestions}
          </div>
      </div>
    );
  },

});

module.exports = Tagger;