var React = require('react');
var Subheader = require('./Subheader');

var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Util = require('./util/util');


var TagActionBar = React.createClass({

  propTypes: {
    numberOfTagsSelected: React.PropTypes.number,
    onUntag: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      style: {}
    };
  },

  getStyle: function() {
    return {
      root: {
        position: 'fixed',
        bottom: 0,
        left:0,
        right: 0,
        zIndex: 2,
        backgroundColor: Color.blue500,
      },
      subheader: {
        float: 'left',
        color: Color.whitePrimary,
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      untag: {
        float: 'right',
        color: Color.whitePrimary,
        cursor: 'pointer',
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
    };
  },

  render: function() {
    var style = Util.merge(this.getStyle(), this.props.style);
    
    var number = this.props.numberOfTagsSelected;
    var text = number + ' tag' + (number !== 1 ? 's' : '') + ' selected';

    return (
      <div style={style.root}>
          <Subheader text={text}
                     style={style.subheader}/>
          <Subheader text="UNTAG"
                     style={style.untag}
                     onClick={this.props.onUntag}/>
      </div>
    );
  }
  
});

module.exports = TagActionBar;