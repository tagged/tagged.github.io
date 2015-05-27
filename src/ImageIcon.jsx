var React = require('react/addons');
var Util = require('./util/util');
var Dimension = require('./res/dimension');

var ImageIcon = React.createClass({

  propTypes: {
    cloud: React.PropTypes.string.isRequired,
    style: React.PropTypes.object
  },

  icons: {
    "dropbox": {
      src: "dropbox-logo-128.png",
      alt: "Dropbox Logo"
    },
    "google": {
      src: "google-drive-logo-128.png",
      alt: "Google Drive Logo"
    }
  },

  render: function() {
    var style = {
      height: Dimension.touchTarget,
      width: Dimension.touchTarget
    };

    var icon = this.icons[this.props.cloud];
    
    return (
      <img src={icon.src}
           alt={icon.alt}
           style={Util.merge(style, this.props.style)}/>
    );
  }

});

module.exports = ImageIcon;