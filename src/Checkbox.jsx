var React = require('react/addons');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var MaterialIconCheckbox = require('./MaterialIconCheckbox');
var MaterialIconCheckboxOutline = require('./MaterialIconCheckboxOutline');
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
          <MaterialIconCheckboxOutline fill={Color.black}
                                       fillOpacity={Color.blackSecondaryOpacity}
                                       style={style.icon}/>
          <MaterialIconCheckbox isChecked={this.props.isChecked}
                                fill={this.props.color}
                                style={style.icon}/>
      </div>
    );
  }

});

module.exports = Checkbox;