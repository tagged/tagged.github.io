var React = require('react/addons');
var R = require('./res/index');
var Animation = R.animation;
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');
var Velocity = require('velocity-animate');

var ExpandCollapse = React.createClass({

  propTypes: {
    isExpanded: React.PropTypes.bool,
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  componentDidMount: function() {
    //Default icon points downward
    if (!this.props.isExpanded) {
      return;
    }
    //Rotate icon to upside-down position
    this.rotateIcon();
  },

  componentDidUpdate: function(prevProps, prevState) {
    //If isExpanded is the same as before, don't rotate
    if (prevProps.isExpanded === this.props.isExpanded) {
      return;
    }
    //Rotate icon
    this.rotateIcon();
  },

  rotateIcon: function() {
    var svg = React.findDOMNode(this.refs.svg);
    Velocity(svg, 'stop', true);
    Velocity({
      elements: svg,
      properties: {rotateZ: this.props.isExpanded ? '180deg' : '0deg'},
      options: Animation.expandCollapse.rotate,
    });
  },

  getStyle: function() {
    return {
      svg: {
        display: 'inline-block',
        verticalAlign: 'top',
        height: Dimension.icon,
        width: Dimension.icon,
        cursor: 'pointer',
        pointerEvents: 'none'
      },
    }
  },

  render: function() {
    var {isExpanded, style, ...props} = this.props;

    var style = Util.merge(this.getStyle(), style);
    
    return (
      <svg ref="svg" 
           style={style.svg}
           viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon}
           {...props}>
          <path d={Icon.expand}/>
      </svg>
    );
  }

});

module.exports = ExpandCollapse;