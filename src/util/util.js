var Immutable = require('immutable');

var properties = {
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
    for (var style in styles) {
      for (var property in styles[style]) {
        if (properties[property]) {
          var capitalizedProperty = property.charAt(0).toUpperCase() + property.slice(1);
          var value = styles[style][property];
          var prefixedProperties = {};
          prefixedProperties["Webkit" + capitalizedProperty] = value;
          prefixedProperties["Moz" + capitalizedProperty] = value;
          prefixedProperties["ms" + capitalizedProperty] = value;
          prefixedProperties["O" + capitalizedProperty] = value;
          this.merge(styles[style], prefixedProperties);
        }
      }
    }
    return styles;
  }

};
