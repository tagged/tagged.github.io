var React = require('react');
var Path = require('./Path');
var Folder = require('./Folder');
var File = require('./File');
var CloudFolder = require('./CloudFolder');
var R = require('./res/index');
var Dimension = R.dimension;
var Providers = R.providers;
var Util = require('./util/util');
var Immutable = require('immutable');

var Cloud = React.createClass({
  
  propTypes: {
    path: React.PropTypes.object,
    folders: React.PropTypes.object,
    files: React.PropTypes.object,
    onPathShorten: React.PropTypes.func,
    onPathLengthen: React.PropTypes.func,
    accounts: React.PropTypes.object,
  },

  getStyle: function() {
    return {
      path: {
        path: {
          marginTop: Dimension.space,
          paddingLeft: Dimension.marginMobile,
          paddingRight: Dimension.marginMobile,
        }
      }
    };
  },

  getFileProps: function(file) {
    return {
      name: file.name,
      path: Util.makePath(file.path),
      modified: file.modified,
      size: file.size,
      type: file.type,
      cloud: file.cloud,
      link: file.link,
      tags: file.tags,
      disabledTags: Immutable.List(), //none
      onTagClick: function() {}, //nothing
      isSelected: this.props.filesSelected.includes(file.id),
      isOpen: this.props.filesOpen.includes(file.id),
      onFileSelect: this.props.onFileSelect.bind(null, file.id),
      onFileToggle: this.props.onFileToggle.bind(null, file.id),
      key: file.id
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var folders;

    //Special folder for each cloud provider
    if (this.props.path.size === 1) {
      folders = Providers.map(function(provider) {
        return (
          <CloudFolder account={this.props.accounts[provider] || "Sign in"}
                       provider={provider}
                       onClick={this.props.onPathLengthen.bind(null, provider)}
                       key={provider}/>
        )
      }, this);
    }
    //Normal folders
    else {
      folders = this.props.folders.map(function(folder) {
        return (
          <Folder name={folder} 
                  onClick={this.props.onPathLengthen.bind(null, folder)}
                  key={folder}/>
        );
      }, this);
    }

    var files = this.props.files.map(function(file) {
      return (
        <File {...this.getFileProps(file)}/>
      );
    }, this);

    return (
      <div style={style.cloud}>
          <Path path={this.props.path} 
                onPathShorten={this.props.onPathShorten}
                style={style.path}/>
          {folders}
          {files}
      </div>
    );
  },

});

module.exports = Cloud;