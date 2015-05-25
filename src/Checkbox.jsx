var React = require('react/addons');
var Dimension = require('./res/dimension');
var SvgIconCheckbox = require('./SvgIconCheckbox');
var SvgIconCheckboxOutline = require('./SvgIconCheckboxOutline');
var Ripples = require('./Ripples');

var Checkbox = React.createClass({

  propTypes: {
    isChecked: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func,
    color: React.PropTypes.string
  },

  getStyle: function() {
    return {
      component: {
        position: 'relative',
        display: 'inline-block',
        boxSizing: 'border-box',
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        cursor: 'pointer'
      },
      icon: {
        position: 'absolute',
        top:  (Dimension.touchTarget - Dimension.icon) / 2,
        left: (Dimension.touchTarget - Dimension.icon) / 2,
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    return (
      <div style={style.component}
           onClick={this.props.handleCheck}>
          <SvgIconCheckboxOutline style={style.icon}/>
          <SvgIconCheckbox isChecked={this.props.isChecked}
                           fill={this.props.color} 
                           style={style.icon}/>
      </div>
    );
//<Ripples color={this.props.color}/>
  }

});

module.exports = Checkbox;