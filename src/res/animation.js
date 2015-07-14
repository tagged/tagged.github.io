var easeIn = function(x) {
  return Math.pow(x,2);
};

var easeOut = function(x) {
  return -(Math.pow((x-1), 2) -1);
};


module.exports = {
  
  snackbar: {
    enter: {
      duration: 350,
      easing: 'ease',
      textDelay: 100,
      textDuration: 250,
    },
    leave: {
      duration: 200,
      easing: 'ease',
    }
  },

  expandCollapse: {
    rotate: {
      duration: 200,
      easing: 'ease',
    }
  },
  
  checkline: {
    animation: {
      duration: 90,
      ease: easeIn
    }
  },
  
  checkmark: {
    downAnimation: {
      duration: 30,
      ease: easeOut
    },
    upAnimation: {
      duration: 60,
      ease: easeIn
    }
  }
  
};