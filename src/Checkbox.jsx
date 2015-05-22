var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var SvgIconCheckbox = require('./SvgIconCheckbox');
var SvgIconCheckboxOutline = require('./SvgIconCheckboxOutline');



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
        padding: (Dimension.touchTarget - Dimension.icon) / 2,
        cursor: 'pointer'
      },
      check: {
        position: 'absolute',
        fill: Color.blue500,
        opacity:    this.props.checked ? 1 : 0,
        transform:  this.props.checked ? 'scale(1)' : 'scale(0)',
        transition: this.props.checked ? 'all 200ms ease-out 0' : 
                    'opacity 200ms ease-out 0, transform 0 ease-out 200ms'
      },
      box: {
        position: 'absolute'
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.checkbox} onClick={this.props.handleClick}>
          <SvgIconCheckboxOutline style={style.box}/>
          <SvgIconCheckbox style={style.check}/>
      </div>
    );
  }

});

module.exports = Checkbox;