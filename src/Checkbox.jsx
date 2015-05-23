var React = require('react/addons');
React.initializeTouchEvents(true);

var Color = require('./res/color');
var Dimension = require('./res/dimension');
var SvgIconCheckbox = require('./SvgIconCheckbox');
var SvgIconCheckboxOutline = require('./SvgIconCheckboxOutline');
var Ripple = require('./Ripple');

var Checkbox = React.createClass({

  propTypes: {
    checked: React.PropTypes.bool,
    handleClick: React.PropTypes.func
  },

  getStyle: function() {
    return {
      checkbox: {
        position: 'relative',
        display: 'inline-block',
        boxSizing: 'border-box',
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        cursor: 'pointer'
      },
      check: {
        position: 'absolute',
        top:  (Dimension.touchTarget - Dimension.icon) / 2,
        left: (Dimension.touchTarget - Dimension.icon) / 2,
        fill: Color.blue500,
        opacity:    this.props.checked ? 1 : 0,
        transform:  this.props.checked ? 'scale(1)' : 'scale(0)',
        transition: this.props.checked ? 'all 200ms ease-out 0' : 
                    'opacity 200ms ease-out 0, transform 0 ease-out 200ms'
      },
      box: {
        position: 'absolute',
        top:  (Dimension.touchTarget - Dimension.icon) / 2,
        left: (Dimension.touchTarget - Dimension.icon) / 2
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.checkbox}
           onClick={this.props.handleClick}
           //onMouseDown={this.showRipple}
           //onMouseUp={this.hideRipple}
           onTouchStart={this.showRipple}
           onTouchEnd={this.hideRipple}>
          <SvgIconCheckboxOutline style={style.box}/>
          <SvgIconCheckbox style={style.check}/>
          <Ripple ref="ripple"/>
      </div>
    );
  },

  showRipple: function() {
    this.refs.ripple.showRipple();
  },

  hideRipple: function() {
    this.refs.ripple.hideRipple();
  }

});

module.exports = Checkbox;