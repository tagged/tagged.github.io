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


//Children of ActionBar should provide a prop called `action`
//The value of `action` is the action's display name in the overflow menu.


var ActionBar = React.createClass({

  propTypes: {
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
    }
  },

  //Invariant: isMenuShowing can be true only if actionsVisible < React.Children.count
  getInitialState: function() {
    return {
      actionsVisible: React.Children.count(this.props.children),
      isMenuShowing: false
    };
  },

  getStyle: function() {
    return {
      actionBar: {
        position: 'relative',
        //Flex container
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      action: {
        //No shrinking in flex container (actionBar)
        flex: '0 0 auto',
      },
      hiddenAction: {
        position: 'absolute',
        visibility: 'hidden'
      },
      overflow: {
        //No shrinking in flex container (actionBar)
        flex: '0 0 auto',
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
        position: 'absolute', 
        top: Dimension.quantum,
        right: Dimension.quantum
      },
      menuItem: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      }
    };
  },

  render: function() {
    var style = Util.prefix(Util.merge(this.getStyle(), this.props.style));

    //Must always render all actions; their widths are needed to calculate actionsVisible
    var actions = React.Children.map(this.props.children, function(child, childIndex) {
      var actionStyle = childIndex < this.state.actionsVisible ? style.action : Util.merge(style.action, style.hiddenAction);
      return (
        <div ref={"action" + childIndex} style={actionStyle}>
            {child}
        </div>
      );
    }, this);

    var overflow = null;
    if (this.state.actionsVisible < React.Children.count(this.props.children)) {
      overflow = (
        <div ref="overflow" onClick={this.showMenu} style={style.overflow}>
            <MaterialIconMoreVert style={style.overflowIcon}/>
        </div>
      );
    }
    
    var menu = null;
    if (this.state.isMenuShowing) {
      var menuItems = [];
      React.Children.forEach(this.props.children, function(child, childIndex) {
        if (childIndex >= this.state.actionsVisible) {
          menuItems.push(
            <div style={style.menuItem} key={"menuItem" + childIndex}>
                {child}
                <Subheader text={child.props.action}/>
            </div>
          );
        }
      }, this);
      menu = (
        <Menu onMenuHide={this.hideMenu} 
              style={style.menu}>
            {menuItems}
        </Menu>
      );
    }

    return (
      <div style={style.actionBar}>
          {actions}
          {overflow}
          {menu}
      </div>
    );

  },

  hideMenu: function() {
    if (this.state.isMenuShowing) {
      this.setState({isMenuShowing: false});
    }
  },

  showMenu: function() {
    if (!this.state.isMenuShowing) {
      this.setState({isMenuShowing: true});
    }
  },

  componentDidMount: function() {
    var actionsVisible = this.calculateActionsVisible();
    if (actionsVisible !== this.state.actionsVisible) {
      this.setState({actionsVisible: actionsVisible});
    }
  },

  componentDidUpdate: function() {
    var actionsVisible = this.calculateActionsVisible();
    if (actionsVisible !== this.state.actionsVisible) {
      this.setState({actionsVisible: actionsVisible});
    }
  },

  calculateActionsVisible: function() {
    //Determine the number of actions to show in the action bar

    //Only call this after render, so action widths are available

    //Don't hide an action by setting its width to 0; 
    //if render is triggered by setState, 
    //action will not be re-rendered and the 0 width 
    //would be used in the width calculation.

    var actionBarWidth = findDOMNodeWidth(this);
    var overflowWidth = this.getStyle().overflow.width;

    var childCount = React.Children.count(this.props.children);
    var currentChild = 0;
    var widthBeforeCurrentChild = 0;

    while (currentChild < childCount) {
      var currentChildWidth = findDOMNodeWidth(this.refs["action" + currentChild]);
      if (widthBeforeCurrentChild + currentChildWidth + overflowWidth > actionBarWidth) {
        //currentChild would overflow the action bar
        break;
      }
      currentChild ++;
      widthBeforeCurrentChild += currentChildWidth;
    }
    
    return currentChild;
  }

});

module.exports = ActionBar;