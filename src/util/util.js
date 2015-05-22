module.exports = {

  //Merge object2 into object1

  merge: function(object1, object2) {
    for (var k in object2) {
      object1[k] = object2[k];
    }
    return object1;
  }

}