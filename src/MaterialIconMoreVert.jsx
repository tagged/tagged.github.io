var React = require('react/addons');
var R = require('./res/index');
var Dimension = R.dimension;
var MaterialIcon = require('./MaterialIcon');

var MaterialIconMoreVert = React.createClass({

  getMaterialIconProps: function() {
    var initializations = [];
    
    var animations = [];

    var d = "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z";

    return {
      initializations: initializations,
      animations: animations,
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

module.exports = MaterialIconMoreVert;