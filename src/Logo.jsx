var React = require('react');
var R = require('./res/index');
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');

var Logo = React.createClass({

  propTypes: {
    cloudColor: React.PropTypes.string,
    tagColor: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  getStyle: function() {
    return {
      svg: {
        display: 'block',
        width: Dimension.logoWidth,
        height: Dimension.logoHeight,
      },
    }
  },

  render: function() {
    var {style, ...props} = this.props;

    var style = Util.merge(this.getStyle(), style);
    
    return (
      <svg ref="svg"
           style={style.svg} 
           viewBox={"0 0 " + Dimension.logoWidth + " " + Dimension.logoHeight}>
          <path d={Icon.logoCloud} fill={this.props.cloudColor}/>
          <path d={Icon.logoTag} fill={this.props.tagColor}/>
      </svg>
    );
  }

});

module.exports = Logo;