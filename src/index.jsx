var React = require('react/addons');
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Paper = require('./Paper');
var AppBar = require('./AppBar');
var AppBarActions = require('./AppBarActions');
var AppBarAction = require('./AppBarAction');
var MaterialIcon = require('./MaterialIcon');
var MaterialIconSearch = require('./MaterialIconSearch');
var MaterialIconCloudQueue = require('./MaterialIconCloudQueue');
var FileTile = require('./FileTile');
var Color = require('./res/color');
var Dimension = require('./res/dimension');


var getGlobalStyle = function() {
  return {
    WebkitTapHighlightColor: 'rgba(0,0,0,0)'
  };
}


var Search = React.createClass({
  render: function() {
    var paperStyle = {height:'56px', margin:'0 20px'}
    return(
      <Paper style={paperStyle}>
          <h1>Search</h1>
      </Paper>
    );
  }
});

var Cloud = React.createClass({
  // Sample files; will generalize later
  getInitialState: function() {
    var files = [{
      name: "Getting Started With a Really really Really really Really really Long Title",
      metadata: {
        "path": "Dropbox/Samples",
        "modified": "Modified 2015 Feb 28",
        "size": "25 KB",
        "type": "PDF"
      },
      tags: ["TAG ","TAG ","TAG "],
      isOpen: false,
      isChecked: false
    }, {
      name: "Second file",
      metadata: {
        "path": "Dropbox/Samples",
        "modified": "Modified 2014 Aug 12",
        "size": "2 KB",
        "type": "DOCX"
      },
      tags: ["TAG ","TAG ","TAG ","TAG ","TAG ",],
      isOpen: false,
      isChecked: false     
    }];
    
    return {
      files: files
    };
  },

  clickedCheckbox: function(fileName) {
    this.toggle(fileName, 'isChecked', 'clicked checkbox');
  },

  toggledCollapsible: function(fileName) {
    this.toggle(fileName, 'isOpen', 'toggled collapsible');
  },

  toggle: function(fileName, fileProperty, message) {
    //Toggle a boolean file property

    var newFiles = this.state.files.map(function(file) {
      if (fileName !== file.name) {
        return file;
      } else {
        var fileCopy = file;
        fileCopy[fileProperty] = !file[fileProperty];
        return fileCopy;
      }
    });

    this.setState({
      files: newFiles
    }, function() {
      console.log(message);
    });
  },

  render: function() {
    var fileTiles = this.state.files.map(function(file) {
      return (
        <FileTile filename={file.name}
                  metadata={file.metadata}
                  tags={file.tags}
                  isChecked={file.isChecked}
                  isOpen={file.isOpen}
                  handleCheck={this.clickedCheckbox.bind(this, file.name)}
                  handleToggle={this.toggledCollapsible.bind(this, file.name)}
                  key={file.name}/>
      );
    }, this);

    return(
      <div style={{paddingTop: Dimension.space}}>
          {fileTiles}
      </div>
    );
  }
});



var Main = React.createClass({

  render: function() {
    return (
      <div  style={getGlobalStyle()}>
          <AppBar>
              <AppBarActions> 
                  <Link to="search"><AppBarAction>
                      <MaterialIconSearch fill={Color.black}
                                          fillOpacity={Color.blackSecondaryOpacity}
                                          style={{}}
                      />
                  </AppBarAction></Link>
                  <Link to="app"><AppBarAction>
                      <MaterialIconCloudQueue fill={Color.black}
                                              fillOpacity={Color.blackSecondaryOpacity}
                                              style={{}}
                      />
                  </AppBarAction></Link>
              </AppBarActions>
          </AppBar>


          <RouteHandler/>

          
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={Main}>
      <Route name="search" handler={Search}/>
      <DefaultRoute handler={Cloud}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});