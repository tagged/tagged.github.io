//Eventually use real database logic

var Immutable = require('immutable');
var RSVP = require('rsvp');

var databaseLatency = 500;

module.exports = {
  

  /**
   * Converts an array of file objects to an 
   * Immutable.OrderedMap where keys are ids 
   * and values are file objects.
   *
   * @param files An array of file objects
   */
  mapFiles: function(files) {
    var pairs = [];
    for (var i=0; i < files.length; i++) {
      var file = files[i];
      //Use full file path as id
      var id = file.path.concat(file.name).join('/');
      pairs.push([id, file]);
    }
    return Immutable.OrderedMap(pairs);
  },
  
  
  //Returns a Promise that resolves after a delay
  //Use this to simulate a delayed database response
  //@param delay the number of millisecond to delay the response; optional
  delayResponse: function(response, delay) {
    if (delay === undefined) {
      delay = databaseLatency;
    }
    return new RSVP.Promise(function(resolve, reject) {
      window.setTimeout(function() {
        resolve(response);
      }, delay);
    });
  },
  
  
};