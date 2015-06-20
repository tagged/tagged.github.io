var React = require('react/addons');
var R = require('./res/index');
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');

var SVG = require('svg.js');

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
  
  getInitialState: function() {
    return {
      wasExpanded: this.props.isExpanded
    };
  },

  renderIcon: function() {
    var svgNode = React.findDOMNode(this.refs.svg);
    svgNode.innerHTML = '';//clear contents
    var svg = SVG(svgNode);

    var isExpanded = this.props.isExpanded;
    var wasExpanded = this.state.wasExpanded;

    var animation = {duration: 200, ease: '<>'};
    
    var icon = svg.path(Icon.expand);
    
    if (!isExpanded && !wasExpanded) {
      return
    }
    else if (isExpanded && wasExpanded) {
      //Just draw icon (rotated up)
      icon.rotate(180);      
    }
    else if (isExpanded) {
      //Animate down to up
      icon.animate(animation).rotate(180);
    }
    else {
      //Animate up to down
      icon.rotate(180).animate(animation).rotate(0);
    }
  },

  componentDidMount: function() {
    this.renderIcon();
  },

  componentDidUpdate: function() {
    this.renderIcon();
  },

  componentWillReceiveProps: function() {
    //Save previous isExpanded prop in state
    this.setState({wasExpanded: this.props.isExpanded});
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
           {...props}/>
    );
  }

});

module.exports = ExpandCollapse;