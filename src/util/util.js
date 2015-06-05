var React = require('react');
var Immutable = require('immutable');

var properties = {
  'flex': true,
  'flexDirection': true,
  'flexWrap': true,
  'justifyContent': true,
  'alignItems': true,
  'userSelect': true,
  'transform': true,
  'transformOrigin': true,
  'transition': true,
  'transitionDelay': true,
  'transitionDuration': true,
  'transitionProperty': true,
  'transitionTimingFunction': true
};

module.exports = {

  getDOMNodeComputedStyle: function(ref, property) {
    //Of a rendered React element
    var node = React.findDOMNode(ref);
    return parseInt(window.getComputedStyle(node)[property]);
  },

  merge: function(object1, object2) {
    var immutableObj1 = Immutable.fromJS(object1);
    var immutableObj2 = Immutable.fromJS(object2);
    return immutableObj1.mergeDeep(immutableObj2).toJS();
  },

  makePath: function(pathArray) {
    //Return a path string for a specified array of directory names
    //String breaks on slashes
    return pathArray.join(String.fromCharCode(8203) + "/");
  },

  prefix: function(styles) {
    var prefixedStyles = Immutable.fromJS(styles).map(function(style, component) {
      for (var property in properties) {
        if (style.has(property)) {
          var capitalizedProperty = property.charAt(0).toUpperCase() + property.slice(1);
          style = style.set("Webkit" + capitalizedProperty, style.get(property));
          style = style.set("Moz" + capitalizedProperty, style.get(property));
          style = style.set("ms" + capitalizedProperty, style.get(property));
          style = style.set("O" + capitalizedProperty, style.get(property));
        }
      }
      return style;
    });
    return prefixedStyles.toJS();
  }

};
