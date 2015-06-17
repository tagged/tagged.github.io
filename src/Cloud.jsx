var React = require('react');
var Path = require('./Path');
var Files = require('./Files');
var R = require('./res/index');
var Dimension = R.dimension;
var Util = require('./util/util');

var Cloud = React.createClass({
  
  propTypes: {
    path: React.PropTypes.object,
    folders: React.PropTypes.object,
    files: React.PropTypes.object,
    onPathShorten: React.PropTypes.func,
  },

  getStyle: function() {
    return {
      path: {
        path: {
          marginTop: Dimension.space,
          paddingLeft: Dimension.marginMobile,
          paddingRight: Dimension.marginMobile,
        }
      }
    };
  },

  render: function() {
    var style = this.getStyle();
    
    return (
      <div style={style.cloud}>
          <Path path={this.props.path} 
                onPathShorten={this.props.onPathShorten}
                style={style.path}/>
      </div>
    );
  },

});

module.exports = Cloud;