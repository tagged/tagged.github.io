var React = require('react');
var SVGIcon = require('./SVGIcon');
var R = require('./res/index');
var Color = R.color;
var Util = require('./util/util');

var MaterialIcon = React.createClass({

  propTypes: {
    d: React.PropTypes.string.isRequired,
    fill: React.PropTypes.string,
    fillOpacity: React.PropTypes.number,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      fill: Color.black,
      fillOpacity: Color.blackSecondaryOpacity
    };
  },

  render: function() {
    return (
      <SVGIcon style={this.props.style} onClick={this.props.onClick}>
          <path ref="iconPath"
                d={this.props.d}
                fill={this.props.fill}
                fillOpacity={this.props.fillOpacity}/>
      </SVGIcon>
    );
  }

});

module.exports = MaterialIcon;