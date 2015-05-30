var React = require('react/addons');
var Checkbox = require('./Checkbox');
var Collapsible = require('./Collapsible');
var MaterialIconExpand = require('./MaterialIconExpand');
var ImageIcon = require('./ImageIcon');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');
var Util = require('./util/util');


var FileTile = React.createClass({

  propTypes: {
    file: React.PropTypes.object.isRequired,
    tagNodes: React.PropTypes.array.isRequired,
    handleSelect: React.PropTypes.func.isRequired,
    handleToggle: React.PropTypes.func.isRequired
  },

  getStyle: function() {
    return {
      component: {
        boxSizing: 'border-box',
        height: 'auto',
        padding: Dimension.quantum
      },
      checkbox: {
        float: 'left',
        marginRight: Dimension.quantum
      },
      filename: {
        boxSizing: 'border-box',
        paddingTop: Dimension.quantum,
        paddingBottom: Dimension.quantum,
        lineHeight: Typography.lineHeight,
        fontSize: Typography.fontSize,
        fontWeight: Typography.fontWeightRegular,
        whiteSpace: this.props.file.isOpen ? 'normal' : 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      subheader: {
        boxSizing: 'border-box',
        paddingBottom: Dimension.quantum,
        lineHeight: Typography.lineHeightSmall,
        fontSize: Typography.fontSizeSmall,
        fontWeight: Typography.fontWeightThin,
        whiteSpace: this.props.file.isOpen ? 'normal' : 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      icon: {
        float: 'right',
        marginLeft: Dimension.quantum
      }
    };
  },

  render: function() {
    var style = this.getStyle();

    var filename = (
      <div style={style.filename}>{this.props.file.name}</div>
    );

    var metadata;
    if (this.props.isOpen) {
      metadata = (
        <div>
            <div style={style.subheader}>{Util.makePath(this.props.file.metadata.path)}</div>
            <div style={style.subheader}>{this.props.file.metadata.modified}</div>
            <div style={style.subheader}>{this.props.file.metadata.size}</div>
            <div style={style.subheader}>{this.props.file.metadata.type}</div>
        </div>
      );
    }
    
    var tagCount = (
      <div style={style.subheader}>
          {this.props.tagNodes.length +
           (this.props.tagNodes.length === 1 ? " tag" : " tags")}
      </div>
    );

    var headContent = (
      <div>
          {filename}
          {metadata}
          {tagCount}
      </div>
    );
    
    var bodyContent = (
      <div>
          {this.props.tagNodes}
      </div>
    );

    var fileLink = (
      <a href={this.props.file.metadata.link}
         target="_blank"
         onClick={function(e){e.stopPropagation();}}>
          <ImageIcon cloud={this.props.file.metadata.cloud}
                     style={style.icon}/>
      </a>
    );

    return (
      <div style={style.component}>
          <Checkbox isChecked={this.props.file.isSelected} 
                    handleCheck={this.props.handleSelect}
                    color={Color.blue500}
                    style={style.checkbox}/>
          <Collapsible head={headContent}
                       body={bodyContent}
                       isOpen={this.props.file.isOpen}
                       handleToggle={this.props.handleToggle}
                       icon={fileLink}/>
      </div>
    );
  }

});

module.exports = FileTile;