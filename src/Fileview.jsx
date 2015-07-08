var React = require('react');
var Tags = require('./Tags');
var Subheader = require('./Subheader');
var TagActionBar = require('./TagActionBar');
var ImageIcon = require('./ImageIcon');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Image = R.image;
var Typography = R.typography;
var Util = require('./util/util');
var Immutable = require('immutable');
var FileStore = require('./res/FileStore');



var Fileview = React.createClass({
  
  propTypes: {
    files: React.PropTypes.array,
    file: React.PropTypes.string,
    onClose: React.PropTypes.func,
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    tagsAttached: React.PropTypes.instanceOf(Immutable.Set),
    tagsDetached: React.PropTypes.instanceOf(Immutable.Set),
    tagsSelected: React.PropTypes.instanceOf(Immutable.Set),
    onTagAttach: React.PropTypes.func,
    onTagDetach: React.PropTypes.func,
    onTagSelect: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      fileview: {
        paddingBottom: Dimension.heightActionBar + Dimension.space + Dimension.quantum
      },
      header: {
        backgroundColor: Color.blue500,
        color: Color.whitePrimary,
        overflow: 'hidden', //clear float
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
      fileName: {
        fontSize: Typography.fontSizeLarge,
        lineHeight: Typography.lineHeightLarge,
        fontWeight: Typography.fontWeightMedium,
        paddingLeft: Dimension.marginMobile,
        paddingTop: Dimension.marginMobile,
        paddingBottom: Dimension.marginMobile,
      },
      metadata: {
        lineHeight: Typography.lineHeight,
        paddingTop: Dimension.quantum,
      },
      body: {
        position: 'relative',
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
        paddingTop: Dimension.space,
      },
      tags: {
        tags: {
          paddingTop: Dimension.space,
        }
      },
      fileLink: {
        display: 'block',
        position: 'absolute',
        top: Dimension.quantum,
        right: Dimension.quantum,
      }
    };
  },

  render: function() {
    var style = this.getStyle();

    // FILE INFO
    
    var file = FileStore.getFile(this.props.files, this.props.file.split('/'));
    var fileName = file.path[file.path.length - 1];
    var filePath = Util.makePath(file.path);
    var fileModified = file.modified;
    var fileSize = file.size;
    var fileType = file.type;
    var fileLink = file.link;
    var fileProvider = file.path[0];
    var tags = Immutable.Set(file.tags)
                        .union(this.props.tagsAttached)
                        .subtract(this.props.tagsDetached)
                        .sort();
    var tagCount = tags.size + (tags.size !== 1 ? " tags" : " tag");
    
    // SUGGESTIONS

    var suggestions = null;
    //Suggest tags starting with value or offer to create tag
    //Don't suggest or offer to create tags already on file
    if (this.props.value !== '') {
      var allFiles = FileStore.getFiles(this.props.files);
      var allTags = FileStore.getTags(allFiles);
      var suggestionTags = allTags.filter(function(tag) {
        return tag.indexOf(this.props.value) === 0;
      }, this).subtract(tags).sort();
      var suggestionLabel;
      if (suggestionTags.size > 0) {
        suggestionLabel = '"' + this.props.value + '"' + " tags";
      }
      else if (tags.includes(this.props.value)) {
        suggestionLabel = 'This file already has tag "' + this.props.value + '"';
      }
      else {
        suggestionLabel =  "Create new tag " + '"' + this.props.value + '"';
      }
      suggestions = (
        <div>
            <Subheader text={suggestionLabel}/>
            <Tags tags={suggestionTags}
                  onTagClick={this.props.onTagAttach}/>
        </div>
      );
    }

    var tagActionBar = null;
    if (this.props.tagsSelected.size > 0) {
      tagActionBar = (
        <TagActionBar numberOfTagsSelected={this.props.tagsSelected.size}
                      onUntag={this.props.onTagDetach.bind(null, this.props.tagsSelected)}/>
      );
    }
    
    return (
      <div style={style.fileview}>
          <div style={style.header}>
              <div style={style.close} onClick={this.props.onClose}>DONE</div>
              <div style={style.fileName}>{fileName}</div>
          </div>
          <div style={style.body}>
              <div style={style.metadata}>{filePath}</div>
              <div style={style.metadata}>{"Modified " + fileModified}</div>
              <div style={style.metadata}>{fileSize}</div>
              <div style={style.metadata}>{fileType}</div>
              <div style={style.metadata}>{tagCount}</div>
              <Tags ref="tags"
                    tags={tags}
                    onTagClick={this.props.onTagSelect}
                    specialTags={this.props.tagsSelected}
                    onSpecialTagClick={this.props.onTagSelect}
                    withInput={true}
                    value={this.props.value}
                    onValueChange={this.props.onValueChange}
                    placeholder={"Add tag"}
                    onSubmit={this.props.onTagAttach}
                    onFocus={this.props.onFocus}
                    style={style.tags}/>
              {suggestions}
              <a href={fileLink}
                 target="_blank"
                 tabIndex="1"
                 style={style.fileLink}>
                  <ImageIcon {...Image[fileProvider]}/>
              </a>
          </div>
          {tagActionBar}
      </div>
    );
  }

});

module.exports = Fileview;