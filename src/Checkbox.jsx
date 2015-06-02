var React = require('react/addons');
var MaterialIconCheckbox = require('./MaterialIconCheckbox');
var MaterialIconCheckboxOutline = require('./MaterialIconCheckboxOutline');
var Ripples = require('./Ripples');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Util = require('./util/util');

var Checkbox = React.createClass({

  propTypes: {
    isChecked: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func,
    color: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getStyle: function() {
    return {
      component: {
        position: 'relative',
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
      <div style={Util.merge(style.component, this.props.style)}
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