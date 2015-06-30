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
    files: React.PropTypes.instanceOf(Immutable.OrderedMap),
    isShowingFiles: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    onClose: React.PropTypes.func,

    taggerValue: React.PropTypes.string,
    allTags: React.PropTypes.object,

    onTaggerValueChange: React.PropTypes.func,
    onTaggerFocus: React.PropTypes.func,

    onTagAttach: React.PropTypes.func,
    onTagDetach: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      tagger: {
        paddingBottom: Dimension.heightActionBar + Dimension.space + Dimension.quantum
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
    
    //Sort files by name
    var files = this.props.files.sort(Util.sortByName).map(function(file, id) {
      return (
        <div style={style.file} key={id}>
            {file.name}
        </div>
      );
    }).valueSeq();

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

    var suggestionTags;
    var suggestionLabel;
    //No value. Suggestions:
    //-tags on some files (if more than one file)
    //-recent tags(?)
    //-all tags(?)
    if (this.props.taggerValue === '') {
      if (files.size > 1 && !tagsOnSomeFiles.isEmpty()) {
        suggestionTags = tagsOnSomeFiles;
        if (files.size === 2) {
          suggestionLabel = "Tags on one file";
        }
        else if (files.size > 2) {
          suggestionLabel = "Tags on some files";
        }
      }
    }
    //Show tags starting with value
    //If no tag starting with value, offer to create it
    else {
      suggestionTags = this.props.allTags.filter(function(tag) {
        return tag.indexOf(this.props.taggerValue) === 0;
      }, this);
      if (suggestionTags.size > 0) {
        suggestionLabel = '"' + this.props.taggerValue + '"' + " tags";
      }
      else {
        suggestionLabel = "Create new tag " + '"' + this.props.taggerValue + '"';
      }
    }
    if (suggestionTags !== undefined) {
      var suggestions = (
        <div>
            <Subheader text={suggestionLabel}/>
            <Tags tags={suggestionTags}
                  disabledTags={tagsOnAllFiles}
                  onTagClick={this.props.onTagAttach}/>
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
                    onTagClick={this.props.onTagDetach}
                    withInput={true}
                    value={this.props.taggerValue}
                    onValueChange={this.props.onTaggerValueChange}
                    placeholder={"Add tag"}
                    onSubmit={this.props.onTagAttach}
                    onFocus={this.props.onTaggerFocus}/>
              {suggestions}
          </div>
      </div>
    );
  },

});

module.exports = Tagger;