var React = require('react');
var R = require('./res/index');
var Dimension = R.dimension;
var Util = require('./util/util');

//SVGIcon provides access to its svg node with ref svg

var SVGIcon = React.createClass({

  propTypes: {
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  getStyle: function() {
    return {
      clearance: {
        position: 'relative',
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        cursor: 'pointer'
      },
      svg: {
        display: 'inline-block',
        position: 'absolute',
        top:  (Dimension.touchTarget - Dimension.icon) / 2,
        left: (Dimension.touchTarget - Dimension.icon) / 2,
        height: Dimension.icon,
        width: Dimension.icon,
        userSelect: 'none',
        pointerEvents: 'none'
      },
    }
  },

  render: function() {
    var {style, ...props} = this.props;

    var style = Util.merge(this.getStyle(), style);
    
    return (
      <div style={style.clearance} {...props}>
          <svg ref="svg"
               style={style.svg} 
               viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon}>
              {this.props.children}
          </svg>
      </div>
    );
  }

});

module.exports = SVGIcon;