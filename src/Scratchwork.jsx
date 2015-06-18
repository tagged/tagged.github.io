var React = require('react/addons');
var MaterialIcon = require('./MaterialIcon');
var ActionBar = require('./ActionBar');
var Snackbar = require('./Snackbar');
var Subheader = require('./Subheader');
var R = require('./res/index');
var Color = R.color;
var Icon = R.icon;



var Scratchwork = React.createClass({

  render: function() {
    var actionBarStyle = {
      actionBar: {
        position: 'fixed', bottom: 0, left:0, right: 0, zIndex: 99, 
        backgroundColor: 'limegreen', 
        paddingTop: 4, paddingBottom: 4,
        paddingRight: 4, paddingLeft: 4,
      },
      menu: {menu: {bottom: 4, top:'auto'}},
    };
    return (
      <div>
          <MaterialIcon d={Icon.checkboxPartial}
                        fill={Color.blue500} 
                        fillOpacity={1}/>
          
          <Snackbar message="Hello, this is a really long message. What happens if a message is really long? Let's find out" 
                    action="UNDO"
                    onAction={function(){alert('Undone!')}}/>
          
          <ActionBar style={actionBarStyle}>
              <MaterialIcon action="Upload"
                            d={Icon.upload}
                            fill={Color.whitePrimary}
                            fillOpacity={1}
                            style={{clearance: {width: 24},
                                    svg: {left: 0}}}/>
              <Subheader action="Upload" 
                         text="UPLOAD"
                         style={{color: 'white'}}/>
              <div action="Blackify" style={{backgroundColor: 'black', width:48, height: 48}}/>
              <div action="Grayify" style={{backgroundColor: 'gray', width:48, height: 48}}/>
              <div action="Indigoify" style={{backgroundColor: 'indigo', width:48, height: 48}}/>
              <div action="Purplify" style={{backgroundColor: 'purple', width:48, height: 48}}/>
              <div action="Yellowify" style={{backgroundColor: 'yellow', width:48, height: 48}}/>
              <div action="Orangify" style={{backgroundColor: 'orange', width:48, height: 48}}/>
              <div action="Redify" style={{backgroundColor: 'red', width:48, height: 48}}/>
              <div action="Pinkify" style={{backgroundColor: 'pink', width:48, height: 48}}/>
              <div action="Blackify" style={{backgroundColor: 'black', width:48, height: 48}}/>
              <div action="Grayify" style={{backgroundColor: 'gray', width:48, height: 48}}/>
              <div action="Indigoify" style={{backgroundColor: 'indigo', width:48, height: 48}}/>
              <div action="Purplify" style={{backgroundColor: 'purple', width:48, height: 48}}/>
              <div action="Yellowify" style={{backgroundColor: 'yellow', width:48, height: 48}}/>
              <div action="Orangify" style={{backgroundColor: 'orange', width:48, height: 48}}/>
              <div action="Redify" style={{backgroundColor: 'red', width:48, height: 48}}/>
              <div action="Pinkify" style={{backgroundColor: 'pink', width:48, height: 48}}/>
          </ActionBar>
      </div>
    );
  }
});

module.exports = Scratchwork;