var React = require('react/addons');
var Checkbox = require('./Checkbox');
var Collapsible = require('./Collapsible');
var Tag = require('./Tag');
var ImageIcon = require('./ImageIcon');

var Constants = require('./constants/index');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');


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
        boxSizing: 'border-box',
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
        boxSizing: 'border-box',
        paddingTop: Dimension.quantum,
        paddingBottom: Dimension.quantum,
        lineHeight: Typography.lineHeight,
        fontSize: Typography.fontSize,
        fontWeight: Typography.fontWeightRegular,
        whiteSpace: this.props.isOpen ? 'normal' : 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      subheader: {
        boxSizing: 'border-box',
        paddingBottom: Dimension.quantum,
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
      icon: {
        float: 'right',
        marginLeft: Dimension.quantum,
        userSelect: 'none'
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
            <div style={style.subheader}>{this.props.path}</div>
            <div style={style.subheader}>{this.props.modified}</div>
            <div style={style.subheader}>{this.props.size}</div>
            <div style={style.subheader}>{this.props.type}</div>
        </div>
      );
    }
    
    var plural = this.props.tags.length !== 1;
    var tagCount = (
      <div style={style.subheader}>
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

    var onClickFileLink = function(event){
      //Don't bubble click to Collapsible header
      event.stopPropagation();
    };
    var fileLink = (
      <a href={this.props.link}
         target="_blank"
         onClick={onClickFileLink}>
          <ImageIcon cloud={this.props.cloud}
                     style={style.icon}/>
      </a>
    );

    return (
      <div style={style.component}>
          <Checkbox checkStatus={this.props.isSelected ? Constants.Ternary.TRUE : Constants.Ternary.FALSE} 
                    boxColor={Color.blue500}
                    checkColor={Color.whitePrimary}
                    style={style.checkbox}
                    onClick={this.props.onFileSelect}/>
          <Collapsible head={headContent}
                       body={bodyContent}
                       isOpen={this.props.isOpen}
                       handleToggle={this.props.onFileToggle}
                       icon={fileLink}/>
      </div>
    );
  }

});

module.exports = File;