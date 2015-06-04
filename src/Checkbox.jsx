var React = require('react/addons');
var SVGIcon = require('./SVGIcon');

var Constants = require('./constants/index');
var FALSE = Constants.Ternary.FALSE;
var INDETERMINATE = Constants.Ternary.INDETERMINATE;
var TRUE = Constants.Ternary.TRUE;

var R = require('./res/index');
var Color = R.color;
var Icon = R.icon;
var Util = require('./util/util');

var SVG = require('svg.js');

var quarticEaseIn = function(x) {
  return Math.pow(x,4);
}

var quarticEaseOut = function(x) {
  return -(Math.pow((x-1), 4) -1);
}

var checkmark = {
  points: '5.705,11.295 10,15.585 18.295,7.29',
  downLength: 6.07051,
  upLength: 11.7309,
  thickness: 2,
  downAnimation: {
    duration: 50,
    ease: quarticEaseOut
  },
  upAnimation: {
    duration: 100,
    ease: quarticEaseIn
  }
};



var Checkbox = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.oneOf([ FALSE, INDETERMINATE, TRUE ]),
    onCheck: React.PropTypes.func,
    backgroundColor: React.PropTypes.string,
    color: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      previousCheckStatus: this.props.checkStatus
    };
  },

  renderCheckbox: function() {
    //Ideally render checkbox declaratively with SVG <animate/>
    //but React does not yet support it or other necessary SVG 
    //attributes like stroke-dashoffset.

    //Also tried using dangerouslySetInnerHTML, but it seems like 
    //one copy of the SVG is used wherever the string is dangerouslySet.

    var svgNode = React.findDOMNode(this.refs.svgIcon.refs.svg);
    svgNode.innerHTML = '';//clear contents
    var svg = SVG(svgNode);

    var current = this.props.checkStatus;
    var previous = this.state.previousCheckStatus;

    if (current === FALSE) {
      svg.path().attr({
        d: Icon.checkboxOutline,
        fill: Color.black,
        'fill-opacity': Color.blackSecondaryOpacity
      });
    }
    else if (current === INDETERMINATE) {
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
    else if (current === TRUE) {
      svg.rect().attr({
        fill: this.props.backgroundColor,
        x: 3, y: 3, rx: 2, ry: 2,
        height: 18, width: 18
      });
      if (previous === TRUE) {
        //Just draw checkmark
        svg.polyline().attr({
          points: checkmark.points,
          fill: 'none',
          stroke: this.props.color,
          'stroke-width': 2,
          'stroke-linecap': 'butt',
          'stroke-linejoin': 'miter',
          'stroke-opacity': 1,
          'stroke-miterlimit': 4
        });
      }
      else {
        //Animate checkmark in
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
    }

  },
  
  render: function() {
    return (
      <SVGIcon ref="svgIcon" 
               onClick={this.props.onCheck}
               style={this.props.style}/>
    );
  },

  componentDidMount: function() {
    this.renderCheckbox();
  },

  componentDidUpdate: function() {
    this.renderCheckbox();
  },

  componentWillReceiveProps: function() {
    //Save previous check status
    this.setState({previousCheckStatus: this.props.checkStatus});
  }
});

module.exports = Checkbox;