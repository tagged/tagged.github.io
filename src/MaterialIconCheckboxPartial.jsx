var React = require('react/addons'); 
var MaterialIcon = require('./MaterialIcon');

var MaterialIconCheckboxOutline = React.createClass({

  getMaterialIconProps: function() {
    var initializations = [{
      properties: {
        fill: this.props.fill,
        fillOpacity: this.props.fillOpacity
      },
      options: {
        duration: 0
      }
    }];
    
    var d = "M 5 3 C 3.892 3 3 3.892 3 5 L 3 19 C 3 20.108 3.892 21 5 21 L 19 21 C 20.108 21 21 20.108 21 19 L 21 5 C 21 3.892 20.108 3 19 3 L 5 3 z M 5 11 L 19 11 L 19 13 L 5 13 L 5 11 z";

    return {
      initializations: initializations,
      style: this.props.style,
      d: d
    };
  },
  
  render: function() {
    var materialIconProps = this.getMaterialIconProps();
    return (
      <MaterialIcon {...materialIconProps}/>
    );
  }

});

module.exports = MaterialIconCheckboxOutline;