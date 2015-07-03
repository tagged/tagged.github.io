var React = require('react/addons');
var Checkbox = require('./Checkbox');
var Collapsible = require('./Collapsible');
var Tags = require('./Tags');
var ImageIcon = require('./ImageIcon');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Image = R.image;
var Typography = R.typography;
var Util = require('./util/util');
var Immutable = require('immutable');

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
    tags: React.PropTypes.instanceOf(Immutable.OrderedSet),
    specialTags: React.PropTypes.instanceOf(Immutable.Set),
    onTagClick: React.PropTypes.func,
    onSpecialTagClick: React.PropTypes.func,
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
      collapsible: {
        component: {
          marginRight: Dimension.touchTarget + Dimension.quantum
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
      tags: {
        tags: {
          paddingTop: Dimension.quantum
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
    
    var plural = this.props.tags.size !== 1;

    var tagCount = (
      <div style={style.metadata}>
          {this.props.tags.size + (plural ? " tags" : " tag")}
      </div>
    );

    return (
      <div style={style.component}>
          <Checkbox checkStatus={this.props.isSelected ? TRUE : FALSE} 
                    boxColor={Color.blue500}
                    checkColor={Color.whitePrimary}
                    style={style.checkbox}
                    onClick={this.props.onFileSelect}/>
          <Collapsible isOpen={this.props.isOpen}
                       onToggle={this.props.onFileToggle}
                       style={style.collapsible}>
              <div isController={true}>
                  {filename}
                  {metadata}
                  {tagCount}
              </div>
              <Tags tags={this.props.tags.sort()}
                    specialTags={this.props.specialTags}
                    onTagClick={this.props.onTagClick}
                    onSpecialTagClick={this.props.onSpecialTagClick}
                    style={style.tags}/>
          </Collapsible>
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