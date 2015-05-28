var React = require('react/addons');
var Checkbox = require('./Checkbox');
var Collapsible = require('./Collapsible');
var MaterialIconExpand = require('./MaterialIconExpand');
var ImageIcon = require('./ImageIcon');
var Tag = require('./Tag');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');

var FileTile = React.createClass({

  propTypes: {
    filename: React.PropTypes.string.isRequired,
    metadata: React.PropTypes.object.isRequired,
    tags: React.PropTypes.array.isRequired,
    isChecked: React.PropTypes.bool.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    handleCheck: React.PropTypes.func.isRequired,
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
      icon: {
        float: 'right',
        marginLeft: Dimension.quantum
      }
    };
  },

  render: function() {
    var style = this.getStyle();

    var filename = (
      <div style={style.filename}>{this.props.filename}</div>
    );

    var metadata;
    if (this.props.isOpen) {
      metadata = (
        <div>
            <div style={style.subheader}>{this.props.metadata.path}</div>
            <div style={style.subheader}>{this.props.metadata.modified}</div>
            <div style={style.subheader}>{this.props.metadata.size}</div>
            <div style={style.subheader}>{this.props.metadata.type}</div>
        </div>
      );
    }

    var tagCount = (
      <div style={style.subheader}>
          {this.props.tags.length +
           (this.props.tags.length === 1 ? " tag" : " tags")}
      </div>
    );

    var headContent = (
      <div>
          {filename}
          {metadata}
          {tagCount}
      </div>
    );
    
    var tags = this.props.tags.map(function(tag) {
      return (
        <Tag text={tag}
             isDisabled={false}
             handleClick={function(){}}
             key={tag}/>
      );
    });

    var bodyContent = (
      <div>
          {tags}
      </div>
    );

    var fileLink = (
      <a href={this.props.metadata.link}
         target="_blank"
         onClick={function(e){e.stopPropagation();}}>
          <ImageIcon cloud={this.props.metadata.cloud}
                     style={style.icon}/>
      </a>
    );

    return (
      <div style={style.component}>
          <Checkbox isChecked={this.props.isChecked} 
                    handleCheck={this.props.handleCheck}
                    color={Color.blue500}
                    style={style.checkbox}/>
          <Collapsible head={headContent}
                       body={bodyContent}
                       isOpen={this.props.isOpen}
                       handleToggle={this.props.handleToggle}
                       icon={fileLink}/>
      </div>
    );
  }

});

module.exports = FileTile;