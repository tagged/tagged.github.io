var React = require('react');
var Menu = require('./Menu');
var Subheader = require('./Subheader');
var MaterialIconMoreVert = require('./MaterialIconMoreVert');
var Dimension = require('./res/dimension');
var Util = require('./util/util');


//Compute width of a rendered React element
function findDOMNodeWidth(ref) {
  var node = React.findDOMNode(ref);
  return parseInt(window.getComputedStyle(node).width);
}


var ActionBar = React.createClass({

  propTypes: {
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
    }
  },

  getStyle: function() {
    return {
      actionBar: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      action: {
        flex: '0 0 auto'
      },
      overflow: {
        flex: '0 0 auto',
        //Determine display after render
        display: 'none',
        position: 'relative',
        height: Dimension.touchTarget,
        width: Dimension.touchTarget,
        cursor: 'pointer'        
      },
      overflowIcon: {
        position: 'absolute',
        top:  (Dimension.touchTarget - Dimension.icon) / 2,
        left: (Dimension.touchTarget - Dimension.icon) / 2,
      },
      menu: {
        //display: 'none',
        position: 'absolute', 
        top: Dimension.space,
        right: Dimension.space
      },
      menuItem: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      }
    };
  },

  render: function() {
    var style = this.getStyle();

    var actions = React.Children.map(this.props.children, function(child, childIndex) {
      return (
        <div ref={"action" + childIndex} style={style.action}>
            {child}
        </div>
      );
    });

    var menuItems = React.Children.map(this.props.children, function(child, childIndex) {
      return (
        <div ref={"menuItem" + childIndex} style={style.menuItem}>
            {child}
            <Subheader text={child.props.action}/>
        </div>
      );
    });

    return (
      <div style={Util.merge(this.props.style, style.actionBar)}>
          {actions}
          <div ref="overflow" style={style.overflow}>
              <MaterialIconMoreVert style={style.overflowIcon}/>
          </div>
          <Menu style={style.menu}>
              {menuItems}
          </Menu>
      </div>
    );
  },

  componentDidMount: function() {
    //Determine if action bar is overflowing

    var isOverflowing = false;
    var overflowWidth = findDOMNodeWidth(this.refs.overflow);
    var actionBarWidth = findDOMNodeWidth(this);

    var childCount = React.Children.count(this.props.children);
    var currentChild = 0;
    var widthBeforeCurrentChild = 0;

    while (currentChild < childCount) {
      var currentChildWidth = findDOMNodeWidth(this.refs["action" + currentChild]);
      if (widthBeforeCurrentChild + currentChildWidth > actionBarWidth - overflowWidth) {
        //Action bar is overflowing
        isOverflowing = true;
        break;
      }
      currentChild ++;
      widthBeforeCurrentChild += currentChildWidth;
    }

    //Handle overflow
    if (isOverflowing) {
      var overflowNode = React.findDOMNode(this.refs.overflow);
      overflowNode.style.display = "block";
    }

    //Hide actions starting from currentChild
    for (var child = currentChild; child < childCount; child++) {
      var actionNode = React.findDOMNode(this.refs["action" + child]);
      actionNode.style.display = "none";
    }

    //Hide menu items ending before currentChild
    for (var child = 0; child < currentChild; child++) {
      var menuItemNode = React.findDOMNode(this.refs["menuItem" + child]);
      menuItemNode.style.display = "none";
    }
    
  },

  

});

module.exports = ActionBar;