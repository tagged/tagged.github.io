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
  },

  uuid: function() {
    //Taken straight from https://gist.github.com/jed/982883
    return (
function b(
  a                  // placeholder
){
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a/4         // 8 to 11
      ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
      ).replace(     // replacing
        /[018]/g,    // zeroes, ones, and eights with
        b            // random hex digits
      )
})();

  },

};
