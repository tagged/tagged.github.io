module.exports = {

  merge: function(object1, object2) {
    //Merge object2 into object1
    for (var k in object2) {
      object1[k] = object2[k];
    }
    return object1;
  },

  makePath: function(pathArray) {
    //Return a path string for a specified array of directory names
    //String breaks on slashes
    return pathArray.join(String.fromCharCode(8203) + "/");
  }


}