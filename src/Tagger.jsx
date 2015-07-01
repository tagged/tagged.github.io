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
var FileStore = require('./res/FileStore');



var Tagger = React.createClass({
  
  propTypes: {
    files: React.PropTypes.array,
    taggerFiles: React.PropTypes.instanceOf(Immutable.Set),
    isShowingFiles: React.PropTypes.bool,
    
    tagsAttached: React.PropTypes.instanceOf(Immutable.Set),
    tagsDetached: React.PropTypes.instanceOf(Immutable.Set),

    onToggle: React.PropTypes.func,
    onClose: React.PropTypes.func,

    taggerValue: React.PropTypes.string,

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
    
    var allFiles = FileStore.getFiles(this.props.files);

    // FILES

    var taggerFiles = allFiles.filter(function(file) {
      return this.props.taggerFiles.includes(file.path.join('/'));
    }, this);

    //Sort by name
    taggerFiles.sort(Util.sortByName);

    var files = taggerFiles.map(function(file) {
      return (
        <div style={style.file} key={file.path.join('/')}>
            {file.path[file.path.length - 1]}
        </div>
      );
    });

    var filesTitle = files.length + " file" + (files.length === 1 ? "" : "s");

    // TAGS

    //Count each tag
    var tagCount = {};
    taggerFiles.forEach(function(file) {
      for (var i=0; i < file.tags.length; i++) {
        var tag = file.tags[i];
        if (!tagCount.hasOwnProperty(tag)) {
          tagCount[tag] = 0;
        }
        tagCount[tag]++;
      }
    });

    //If a tag's count is equal to the number of files,
    //then that tag must belong to all files. Otherwise
    //that tag is only on some files.
    
    var tagsOnAllFiles = [];
    var tagsOnSomeFiles = [];
    for (var tag in tagCount) {
      var count = tagCount[tag];
      if (count === files.length) {
        tagsOnAllFiles.push(tag);
      }
      else {
        tagsOnSomeFiles.push(tag);
      }
    }
    
    tagsOnAllFiles = Immutable.Set(tagsOnAllFiles);
    tagsOnSomeFiles = Immutable.Set(tagsOnSomeFiles);

    //Pretend tagAttached is on all files
    if (!this.props.tagsAttached.isEmpty()) {
      tagsOnAllFiles = tagsOnAllFiles.union(this.props.tagsAttached);
      tagsOnSomeFiles = tagsOnSomeFiles.subtract(this.props.tagsAttached);
    }
    //Pretend tagsDetached are on no files
    if (!this.props.tagsDetached.isEmpty()) {
      tagsOnAllFiles = tagsOnAllFiles.subtract(this.props.tagsDetached);
    }
    
    var tagsOnAllFilesTitle;
    if (files.length === 1) {
      tagsOnAllFilesTitle = "Tags";
    }
    else if (files.length === 2) {
      tagsOnAllFilesTitle = "Tags on both files";
    }
    else if (files.length > 2) {
      tagsOnAllFilesTitle = "Tags on all files";
    }

    //Save handleTagAttach from recalculating tag counts
    var onTagAttach = this.props.onTagAttach.bind(null, tagCount);

    // SUGGESTIONS

    var suggestionTags;
    var suggestionLabel;
    //No value. Suggestions:
    //-tags on some files (if more than one file)
    //-recent tags(?)
    //-all tags(?)
    if (this.props.taggerValue === '') {
      if (files.length > 1 && !tagsOnSomeFiles.isEmpty()) {
        suggestionTags = tagsOnSomeFiles;
        if (files.length === 2) {
          suggestionLabel = "Tags on one file";
        }
        else if (files.length > 2) {
          suggestionLabel = "Tags on some files";
        }
      }
    }
    //Show tags starting with value
    //If no tag starting with value, offer to create it
    else {
      var allTags = FileStore.getTags(allFiles);
      suggestionTags = allTags.filter(function(tag) {
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
            <Tags tags={suggestionTags.sort()}
                  disabledTags={tagsOnAllFiles}
                  onTagClick={onTagAttach}/>
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
                      {filesTitle}
                      <ExpandCollapse isExpanded={this.props.isShowingFiles}
                                      fill={Color.whitePrimary}
                                      style={style.expandCollapse}/>
                  </div>
                  {files}
              </Collapsible>
          </div>
          <div style={style.body}>
              <Subheader text={tagsOnAllFilesTitle}/>
              <Tags ref="tagsOnAllFiles"
                    tags={tagsOnAllFiles.sort()}
                    onTagClick={this.props.onTagDetach}
                    withInput={true}
                    value={this.props.taggerValue}
                    onValueChange={this.props.onTaggerValueChange}
                    placeholder={"Add tag"}
                    onSubmit={onTagAttach}
                    onFocus={this.props.onTaggerFocus}/>
              {suggestions}
          </div>
      </div>
    );
  },

});

module.exports = Tagger;