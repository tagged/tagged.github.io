var React = require('react/addons');
var MaterialIcon = require('./MaterialIcon');

var Constants = require('./constants/index');
var FALSE = Constants.Ternary.FALSE;
var INDETERMINATE = Constants.Ternary.INDETERMINATE;
var TRUE = Constants.Ternary.TRUE;

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Icon = R.icon;
var Util = require('./util/util');

var SVG = require('svg.js');

var checkmark = {
  points: '5.705,11.295 10,15.585 18.295,7.29',
  downLength: 6.07051,
  upLength: 11.7309,
  thickness: 2,
  downAnimation: {
    duration: 50,
    ease: '-'
  },
  upAnimation: {
    duration: 100,
    ease: function(x) {
      return Math.pow(x,4);
    }
  }
};




var Checkbox = React.createClass({

  propTypes: {
    checkState: React.PropTypes.oneOf([ FALSE, INDETERMINATE, TRUE ]),
    handleClick: React.PropTypes.func,
    backgroundColor: React.PropTypes.string,
    color: React.PropTypes.string,
    style: React.PropTypes.object
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
        userSelect: 'none'
      }
    };
  },

  renderCheckbox: function() {
    //Ideally render checkbox declaratively with SVG <animate/>
    //but React does not yet support it or other necessary SVG 
    //attributes like stroke-dashoffset.

    //Also tried using dangerouslySetInnerHTML, but it seems like 
    //one copy of the SVG is used wherever the string is dangerouslySet.

    var svgNode = React.findDOMNode(this.refs.svg);
    svgNode.innerHTML = '';//clear contents
    var svg = SVG(svgNode).viewbox(0,0,Dimension.icon,Dimension.icon);

    if (this.props.checkState === FALSE) {
      svg.path().attr({
        d: Icon.checkboxOutline,
        fill: Color.black,
        'fill-opacity': Color.blackSecondaryOpacity
      });
    }
    else if (this.props.checkState === INDETERMINATE) {
      svg.rect().attr({
        fill: this.props.backgroundColor,
        x: 3, y: 3, rx: 2, ry: 2,
        height: 18, width: 18
      });

      svg.polyline().attr({
        points: '5,12 12,12 19,12',
        fill: 'none',
        stroke: this.props.color,
        'stroke-width': 2,
        'stroke-linecap': 'butt',
        'stroke-linejoin': 'miter',
        'stroke-opacity': 1,
        'stroke-miterlimit': 4,
        'stroke-dasharray': 14,
        'stroke-dashoffset': 14
      }).animate({
        duration: 450, 
        ease: '-'
      }).attr({
        'stroke-dashoffset': 0
      });
    }
    else if (this.props.checkState === TRUE) {
      svg.rect().attr({
        fill: this.props.backgroundColor,
        x: 3, y: 3, rx: 2, ry: 2,
        height: 18, width: 18
      });
      svg.polyline().attr({
        points: checkmark.points,
        fill: 'none',
        stroke: this.props.color,
        'stroke-width': 2,
        'stroke-linecap': 'butt',
        'stroke-linejoin': 'miter',
        'stroke-opacity': 1,
        'stroke-miterlimit': 4,
        'stroke-dasharray': checkmark.downLength + checkmark.upLength,
        'stroke-dashoffset': checkmark.downLength + checkmark.upLength
      }).animate(checkmark.downAnimation).attr({
        'stroke-dashoffset': checkmark.upLength - checkmark.thickness / 2
      }).after(function() {
        this.animate(checkmark.upAnimation).attr({
          'stroke-dashoffset': 0
        });
      });
    }

  },
  
  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);

    return (
      <div style={style.clearance} onClick={this.handleClick}>
          <svg style={style.svg} ref="svg"/>
      </div>
    );
  },

  componentDidMount: function() {
    this.renderCheckbox();
  },

  componentDidUpdate: function() {
    this.renderCheckbox();
  },

  handleClick: function() {
    this.setState({previousCheckState: this.props.checkState});
    this.props.handleCheck();
  }

});

module.exports = Checkbox;