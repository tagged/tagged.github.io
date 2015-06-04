var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Util = require('./util/util');

var MaterialIcon = React.createClass({

  propTypes: {
    d: React.PropTypes.string.isRequired,
    fill: React.PropTypes.string,
    fillOpacity: React.PropTypes.number,
    style: React.PropTypes.object,
    onClick: React.PropTypes.func,
  },

  getDefaultProps: function() {
    // Provide defaults for optional props
    return {
      fill: '#000000',
      fillOpacity: 0
    };
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
      },
    }
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);
    return (
      <div style={style.clearance} onClick={this.props.onClick}>
          <svg style={style.svg} viewBox={"0 0 " + Dimension.icon + " " + Dimension.icon}>
              <path ref="iconPath"
                    d={this.props.d}
                    fill={this.props.fill}
                    fillOpacity={this.props.fillOpacity}/>
          </svg>
      </div>
    );
  }

module.exports = MaterialIcon;