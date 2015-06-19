var React = require('react/addons');
var Checkbox = require('./Checkbox');
var Collapsible = require('./Collapsible');
var Tag = require('./Tag');
var ImageIcon = require('./ImageIcon');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Image = R.image;
var Typography = R.typography;
var Util = require('./util/util');

var TRUE = R.constant.ternary.TRUE;
var FALSE = R.constant.ternary.FALSE;

var File = React.createClass({

  propTypes: {
    name: React.PropTypes.string,
    path: React.PropTypes.string,
    modified: React.PropTypes.string,
    size: React.PropTypes.string,
    type: React.PropTypes.string,
    cloud: React.PropTypes.string,
    link: React.PropTypes.string,
    tags: React.PropTypes.array,
    disabledTags: React.PropTypes.object,
    onTagClick: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
    isOpen: React.PropTypes.bool,
    onFileSelect: React.PropTypes.func,
    onFileToggle: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      component: {
        position: 'relative',
        overflow: 'hidden',//clear floated checkbox
        height: 'auto',
        padding: Dimension.quantum
      },
      checkbox: {
        clearance: {
          float: 'left',
          marginRight: Dimension.quantum
        }
      },
      filename: {
        paddingTop: Dimension.quantum,
        lineHeight: Typography.lineHeight,
        fontSize: Typography.fontSize,
        fontWeight: Typography.fontWeightRegular,
        whiteSpace: this.props.isOpen ? 'normal' : 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      metadata: {
        lineHeight: Typography.lineHeightSmall,
        fontSize: Typography.fontSizeSmall,
        fontWeight: Typography.fontWeightThin,
        whiteSpace: this.props.isOpen ? 'normal' : 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      tagNodes: {
        paddingTop: Dimension.quantum
      },
      tag: {
        tag: {
          backgroundColor: Color.blue100,
          cursor: 'pointer',
          outlineColor: Color.blue500
        }
      },
      tagDisabled: {
        tag: {
          backgroundColor: Color.blackDivider,
          cursor: 'auto',
          outlineColor: Color.blackHint
        }
      },
      fileLink: {
        display: 'block',
        position: 'absolute',
        top: Dimension.quantum,
        right: Dimension.quantum,
        marginLeft: Dimension.quantum,
      }
    };
  },

  render: function() {
    var style = Util.prefix(this.getStyle());

    var filename = (
      <div style={style.filename}>{this.props.name}</div>
    );

    var metadata;
    if (this.props.isOpen) {
      metadata = (
        <div>
            <div style={style.metadata}>{this.props.path}</div>
            <div style={style.metadata}>{this.props.modified}</div>
            <div style={style.metadata}>{this.props.size}</div>
            <div style={style.metadata}>{this.props.type}</div>
        </div>
      );
    }
    
    var plural = this.props.tags.length !== 1;
    var tagCount = (
      <div style={style.metadata}>
          {this.props.tags.length + (plural ? " tags" : " tag")}
      </div>
    );

    var headContent = (
      <div>
          {filename}
          {metadata}
          {tagCount}
      </div>
    );
    
    var tagNodes = this.props.tags.map(function(tag) {
      var isDisabled = this.props.disabledTags.includes(tag);

      var onClick = function(event) {
        if (!isDisabled) {
          this.props.onTagClick(tag);
        }
      }.bind(this);

      return (
        <Tag text={tag}
             style={isDisabled ? style.tagDisabled : style.tag}
             onClick={onClick}
             key={tag}/>
      );
    }, this);

    var bodyContent = (
      <div style={style.tagNodes}>
          {tagNodes}
      </div>
    );

    return (
      <div style={style.component}>
          <Checkbox checkStatus={this.props.isSelected ? TRUE : FALSE} 
                    boxColor={Color.blue500}
                    checkColor={Color.whitePrimary}
                    style={style.checkbox}
                    onClick={this.props.onFileSelect}/>
          <Collapsible head={headContent}
                       body={bodyContent}
                       isOpen={this.props.isOpen}
                       handleToggle={this.props.onFileToggle}/>
          <a href={this.props.link}
             target="_blank"
             tabIndex="1"
             style={style.fileLink}>
              <ImageIcon {...Image[this.props.cloud]}/>
          </a>
      </div>
    );
  }

});

module.exports = File;