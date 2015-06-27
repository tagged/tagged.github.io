var React = require('react');
var Path = require('./Path');
var Folder = require('./Folder');
var CloudFolder = require('./CloudFolder');
var File = require('./File');
var FileActionBar = require('./FileActionBar');

var R = require('./res/index');
var Dimension = R.dimension;
var Providers = R.providers;
var Util = require('./util/util');
var Immutable = require('immutable');

var Cloud = React.createClass({
  
  propTypes: {
    accounts: React.PropTypes.object,
    path: React.PropTypes.object,
    folders: React.PropTypes.object,
    files: React.PropTypes.object,

    onPathShorten: React.PropTypes.func,
    onPathLengthen: React.PropTypes.func,

    onFileToggle: React.PropTypes.func,
    onFileSelect: React.PropTypes.func,
    onFileSelectAll: React.PropTypes.func,
    onFileUnselectAll: React.PropTypes.func,
    onFileDelete: React.PropTypes.func,
    onFileTag: React.PropTypes.func,
    onFileUpload: React.PropTypes.func,
    onFileDrop: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      cloud: {
        paddingBottom: Dimension.heightActionBar + Dimension.space + Dimension.quantum
      },
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
      tags: Immutable.OrderedSet(file.tags),
      disabledTags: Immutable.Set(file.tags), //all
      onTagClick: Util.noop, //nothing
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
        var account = this.props.accounts[provider.name];
        var onClick;
        if (account === null) {
          account = "Sign in";
          onClick = function() {
            window.open(provider.login, '_blank');
          };
        }
        else {
          onClick = this.props.onPathLengthen.bind(null, provider.name);
        }
        return (
          <CloudFolder account={account}
                       provider={provider.name}
                       onClick={onClick}
                       key={provider.name}/>
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

    var fileActionBar = null;
    if (this.props.path.size > 1) {
      fileActionBar = (
        <FileActionBar numberOfFiles={this.props.files.size}
                       numberOfFilesSelected={this.props.filesSelected.size}
                       onSelectAll={this.props.onFileSelectAll}
                       onUnselectAll={this.props.onFileUnselectAll}
                       onDelete={this.props.onFileDelete}
                       onTag={this.props.onFileTag}
                       canUpload={true}
                       onFileUpload={this.props.onFileUpload}/>
      );
    }

    return (
      <div style={style.cloud} 
           onDrop={this.handleFileDrop}
           onDragOver={this.handleFileDragOver}>
          <Path path={this.props.path} 
                onPathShorten={this.props.onPathShorten}
                style={style.path}/>
          {folders}
          {files}
          {fileActionBar}
      </div>
    );
  },

  handleFileDrop: function(event) {
    this.props.onFileDrop(event);
  },
  
  handleFileDragOver: function(event) {
    event.preventDefault();
    var dropEffect = this.props.path.size > 1 ? 'copy' : 'none';
    event.dataTransfer.dropEffect = dropEffect;
  },

});

module.exports = Cloud;