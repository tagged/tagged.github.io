var React = require('react');
var Immutable = require('immutable');

var properties = Immutable.Set([
  'flex',
  'flexDirection',
  'flexWrap',
  'justifyContent',
  'alignItems',
  'userSelect',
  'transform',
  'transformOrigin',
  'transition',
  'transitionDelay',
  'transitionDuration',
  'transitionProperty',
  'transitionTimingFunction'
]);

module.exports = {

  noop: function() {},

  call: function(func) {
    if (typeof func === 'function') {
      func();
    }
  },

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

  prefix: function(obj) {
    //Prefix styles. Recursively handles nesting.
    var newObj = {};
    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        //Recursively prefix nested objects
        newObj[key] = this.prefix(obj[key]);
      }
      else {
        //Push style to new object
        newObj[key] = obj[key];
        if (properties.includes(key)) {
          //Also push prefixed styles to new object
          var capitalizedProperty = key.charAt(0).toUpperCase() + key.slice(1);
          newObj["Webkit" + capitalizedProperty] = obj[key];
          newObj["Moz" + capitalizedProperty] = obj[key];
          newObj["ms" + capitalizedProperty] = obj[key];
          newObj["O" + capitalizedProperty] = obj[key];
        }
      }
    }
    return newObj;
  }

};
