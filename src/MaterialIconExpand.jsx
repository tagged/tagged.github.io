var React = require('react/addons');
var R = require('./res/index');
var Dimension = R.dimension;
var MaterialIcon = require('./MaterialIcon');

var MaterialIconExpand = React.createClass({

  getMaterialIconProps: function() {
    
    var initializations = [{
      properties: {
        transformOriginX: Dimension.icon / 2,
        transformOriginY: Dimension.icon / 2
      },
      options: {
        duration: 0
      }
    }];

    var animations = [{
      properties: {
        rotateZ: this.props.isExpanded ? "180deg" : 0
      },
      options: {
        duration: 200,
        easing: "ease"
      }
    }];
    
    var d = "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z";

    return {
      initializations: initializations,
      animations: animations
    };
  },

  render: function() {
    var materialIconProps = this.getMaterialIconProps();
    return (
      <MaterialIcon {...materialIconProps}/>
    );
  }

});

module.exports = MaterialIconExpand;