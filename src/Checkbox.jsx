var React = require('react/addons');
var SVGIcon = require('./SVGIcon');

var R = require('./res/index');
var Animation = R.animation;
var Color = R.color;
var Icon = R.icon;
var Util = require('./util/util');
var Velocity = require('velocity-animate');

var FALSE = R.constant.ternary.FALSE;
var INDETERMINATE = R.constant.ternary.INDETERMINATE;
var TRUE = R.constant.ternary.TRUE;

var checkmark = {
  points: '5.705,11.295 10,15.585 18.295,7.29',
  downLength: 6.07051,
  upLength: 11.7309,
  thickness: 2,
};

var checkline = {
  points: '5,12 12,12 19,12',
  totalLength: 14,
};

var checkboxMark = {
  points: checkmark.points,
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'butt',
};
          
var checkboxLine = {
  points: checkline.points,
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'butt',
};

var  checkboxRect = {
  x: 3, y: 3, 
  rx: 2, ry: 2,
  height: 18, width: 18,
};



var Checkbox = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.oneOf([ FALSE, INDETERMINATE, TRUE ]),
    outlineColor: React.PropTypes.string,
    outlineOpacity: React.PropTypes.number,
    boxColor: React.PropTypes.string,
    boxOpacity: React.PropTypes.number,
    checkColor: React.PropTypes.string,
    checkOpacity: React.PropTypes.number,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      outlineOpacity: 1,
      boxOpacity: 1,
      checkOpacity: 1,
    };
  },

  render: function() {
    var {checkStatus,
         outlineColor, 
         outlineOpacity,
         boxColor, 
         boxOpacity,
         checkColor, 
         checkOpacity,
         style, 
         ...props} = this.props;

    var icon;
    if (checkStatus === FALSE) {
      icon = (
        <path d={Icon.checkboxOutline}
              fill={outlineColor}
              fillOpacity={outlineOpacity}/>
      );
    }
    else {
      var polyline;
      if (checkStatus === INDETERMINATE) {
        polyline = <polyline ref="polyline"
                             stroke={checkColor}
                             strokeOpacity={checkOpacity}
                             {...checkboxLine}/>;
      }
      else if (checkStatus === TRUE) {
        polyline = <polyline ref="polyline"
                             stroke={checkColor}
                             strokeOpacity={checkOpacity}
                             {...checkboxMark}/>;
      }
      icon = (
        <g>
            <rect {...checkboxRect} fill={boxColor} fillOpacity={boxOpacity}/>
            {polyline}
        </g>
      );
    }
      
    return (
      <SVGIcon ref="svgIcon"
               style={style}
               {...props}>
          {icon}
      </SVGIcon>
    );
  },

  componentDidMount: function() {
    this.animateCheckmark(this.props);
  },

  componentDidUpdate: function(prevProps) {
    this.animateCheckmark(prevProps);
  },
  
  animateCheckmark: function(prevProps) {
    var polyline = React.findDOMNode(this.refs.polyline);
    Velocity(polyline, 'stop', true);

    //Animate checkline
    if (this.props.checkStatus === INDETERMINATE && prevProps.checkStatus !== INDETERMINATE) {
      Velocity({
        elements: polyline,
        properties: {
          strokeDasharray: checkline.totalLength,
          strokeDashoffset: checkline.totalLength,
        },
        options: {
          duration: 0
        }
      });
      Velocity({
        elements: polyline,
        properties: {
          strokeDashoffset: 0,
        },
        options: {
          duration: Animation.checkline.animation.duration,
          easing: Animation.checkline.animation.easing,
        }
      });
    }
    
    //Animate checkmark
    else if (this.props.checkStatus === TRUE && prevProps.checkStatus !== TRUE) {
      Velocity({
        elements: polyline,
        properties: {
          strokeDasharray: checkmark.downLength + checkmark.upLength,
          strokeDashoffset: checkmark.downLength + checkmark.upLength,
        },
        options: {
          duration: 0
        }
      });
      Velocity({
        elements: polyline,
        properties: {
          strokeDashoffset: checkmark.upLength - checkmark.thickness / 2,
        },
        options: {
          duration: Animation.checkmark.downAnimation.duration,
          easing: Animation.checkmark.downAnimation.easing,
        }
      });
      Velocity({
        elements: polyline,
        properties: {
          strokeDashoffset: 0,
        },
        options: {
          duration: Animation.checkmark.upAnimation.duration,
          easing: Animation.checkmark.upAnimation.easing,
        }
      });
    }
    
  }
  
});

module.exports = Checkbox;