var React = require('react');
var Path = require('./Path');
var Folder = require('./Folder');
var CloudFolder = require('./CloudFolder');
var File = require('./File');
var FileActionBar = require('./FileActionBar');

var R = require('./res/index');
var Dimension = R.dimension;
var Providers = R.providers;
var Shadow = R.shadow;
var Util = require('./util/util');
var Immutable = require('immutable');
var FileStore = require('./res/FileStore');


var Cloud = React.createClass({
  
  propTypes: {
    accounts: React.PropTypes.object,
    path: React.PropTypes.array,
    
    files: React.PropTypes.array,
    filesDeleted: React.PropTypes.instanceOf(Immutable.Set),
    filesSelected: React.PropTypes.instanceOf(Immutable.Set),
    filesOpen: React.PropTypes.instanceOf(Immutable.Set),
    
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
      },
      fileActionBar: {
        root: {
          boxShadow: Shadow.zDepthTop[1],
        }
      }
    };
  },

  getFileProps: function(file) {
    var path = file.path.join('/');
    return {
      name: file.path[file.path.length - 1],
      path: Util.makePath(file.path.slice(0,-1)),
      modified: file.modified,
      size: file.size,
      type: file.type,
      cloud: file.path[0],
      link: file.link,
      tags: Immutable.OrderedSet(file.tags),
      disabledTags: Immutable.Set(file.tags), //all
      onTagClick: Util.noop, //nothing
      isSelected: this.props.filesSelected.includes(path),
      isOpen: this.props.filesOpen.includes(path),
      onFileSelect: this.props.onFileSelect.bind(null, path),
      onFileToggle: this.props.onFileToggle.bind(null, path),
      key: path
    };
  },

  render: function() {
    var style = this.getStyle();
    
    var contents = FileStore.getContents(this.props.files, this.props.path.slice(1));

    // FOLDERS
    
    var cloudFolders = contents.folders;
    cloudFolders.sort();
    
    //Special folder for each cloud provider
    if (this.props.path.length === 1) {
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
      folders = cloudFolders.map(function(folder) {
        return (
          <Folder name={folder}
                  onClick={this.props.onPathLengthen.bind(null, folder)}
                  key={folder}/>
        );
      }, this);
    }

    // FILES
    
    //Filter out deleted files
    var cloudFiles = contents.files.filter(function(file) {
      return !this.props.filesDeleted.includes(file.path.join('/'));
    }, this);

    var files;
    files = cloudFiles.map(function(file) {
      return (
        <File {...this.getFileProps(file)}/>
      );
    }, this);

    // FILE ACTION BAR
    
    var cloudFilePaths = cloudFiles.map(function(file) {
      return file.path.join('/');
    });
    
    var fileActionBar = null;
    if (this.props.path.length > 1) {
      fileActionBar = (
        <FileActionBar numberOfFiles={cloudFiles.length}
                       numberOfFilesSelected={this.props.filesSelected.size}
                       onSelectAll={this.props.onFileSelectAll.bind(null, cloudFilePaths)}
                       onUnselectAll={this.props.onFileUnselectAll}
                       onDelete={this.props.onFileDelete.bind(null, this.props.filesSelected)}
                       onTag={this.props.onFileTag}
                       canUpload={true}
                       onFileUpload={this.props.onFileUpload}
                       style={style.fileActionBar}/>
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
    var dropEffect = this.props.path.length > 1 ? 'copy' : 'none';
    event.dataTransfer.dropEffect = dropEffect;
  },

});

module.exports = Cloud;