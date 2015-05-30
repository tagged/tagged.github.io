var React = require('react');
var File = require('./File');
var Util = require('./util/util');

var Files = React.createClass({
  
  propTypes: {
    files: React.PropTypes.array,
    onFileSelect: React.PropTypes.func,
    onFileToggle: React.PropTypes.func,
    disabledTags: React.PropTypes.array,
    onTagClick: React.PropTypes.func
  },

  getFileProps: function(file, fileIndex) {
    
    var onFileSelect = function() {
      this.props.onFileSelect(fileIndex);
    }.bind(this);

    var onFileToggle = function() {
      this.props.onFileToggle(fileIndex);
    }.bind(this);

    return {
      name: file.name,
      path: Util.makePath(file.path),
      modified: file.modified,
      size: file.size,
      type: file.type,
      cloud: file.cloud,
      link: file.link,
      tags: file.tags,
      disabledTags: this.props.disabledTags,
      onTagClick: this.props.onTagClick,
      isSelected: file.isSelected,
      isOpen: file.isOpen,
      onFileSelect: onFileSelect,
      onFileToggle: onFileToggle,
      key: file.id
    };

  },
  
  render: function() {
    var fileNodes = this.props.files.map(function(file, fileIndex) {
      return (
        <File {...this.getFileProps(file, fileIndex)}/>
      );
    }, this);

    return (
      <div>
          {fileNodes}
      </div>
    );
  }

});

module.exports = Files;