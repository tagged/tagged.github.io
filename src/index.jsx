var React = require('react/addons');
var injectTapEventPlugin = require("react-tap-event-plugin");
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
var SvgIcon = require('./SvgIcon');
var SvgIconSearch = require('./SvgIconSearch');
var SvgIconCloudQueue = require('./SvgIconCloudQueue');
var Checkbox = require('./Checkbox');

var Color = require('./res/color');


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
  getInitialState: function() {
    return {
      checkbox: false
    };
  },

  clickedCheckbox: function() {
    this.setState({
      checkbox: !this.state.checkbox
    }, function() {
      console.log('clicked checkbox');
    });
  },

  render: function() {
    var paperStyle = {height:'20px', marginTop:'50px'};
    return(
      <Paper style={paperStyle}>
          <h1>Cloud</h1>
          <Checkbox isChecked={this.state.checkbox} 
                    handleCheck={this.clickedCheckbox}
                    color={Color.blue500}/>

      </Paper>
    );
  }
});



var Main = React.createClass({

  render: function() {
    return (
      <div>
          <AppBar>
              <AppBarActions> 
                  <Link to="search"><AppBarAction>
                      <SvgIconSearch 
                          style={{}}
                      />
                  </AppBarAction></Link>
                  <Link to="app"><AppBarAction>
                      <SvgIconCloudQueue
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