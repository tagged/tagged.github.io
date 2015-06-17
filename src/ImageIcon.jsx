var React = require('react/addons');
var Util = require('./util/util');
var R = require('./res/index');
var Dimension = R.dimension;

var ImageIcon = React.createClass({

  propTypes: {
    style: React.PropTypes.object
  },
  
  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  getStyle: function() {
    return {
      height: Dimension.touchTarget,
      width: Dimension.touchTarget
    };
  },
  
  render: function() {
    var {style, ...props} = this.props;

    style = Util.merge(this.getStyle(), style);
    
    return (
      <img {...props} style={style}/>
    );
  }

});

module.exports = ImageIcon;