var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

var TagInput = React.createClass({
  //Single line of text
  //Grows with user input

  propTypes: {
    value: React.PropTypes.string,
    isFocused: React.PropTypes.bool,
    handleFocus: React.PropTypes.func.isRequired,
    handleBlur: React.PropTypes.func.isRequired,
    handleChange: React.PropTypes.func.isRequired,

    placeholder: React.PropTypes.string,  //input placeholder text
    //max width of input; excludes padding and borders
    maxWidth: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },

  getStyle: function() {
    var verticalPadding = (Dimension.heightTag - Typography.lineHeight * Typography.fontSize) / 2;
    
    return {
      component: {
        display: 'inline-block',
        position: 'relative',
        marginRight: Dimension.space,
        marginBottom: Dimension.space,
        fontSize: Typography.fontSize,
        fontWeight: Typography.fontWeightRegular
      },
      input: {
        display: 'inline-block',
        margin: 0,
        outline: 0,
        borderWidth: Dimension.borderWidth,
        borderStyle: 'solid',
        borderColor: this.props.isFocused ? Color.blue500 : Color.blackSecondary,
        borderRadius: Dimension.borderRadius,
        paddingLeft: Dimension.space,
        paddingRight: Dimension.space,
        font: 'inherit',
        lineHeight: Typography.lineHeight,
        paddingTop: verticalPadding - Dimension.borderWidth,
        paddingBottom: verticalPadding - Dimension.borderWidth,
        color: Color.blackPrimary,
        minWidth: 1,
        maxWidth: this.props.maxWidth || 'none'
      },
      regulator: {
        //Regulator width is guaranteed to be less than input width
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'nowrap'
      }
    };
  },

  render: function() {
    var style = this.getStyle();

    // Make spaces count towards computed regulator width
    var nbspValue = this.props.value.replace(/ /g, String.fromCharCode(160));

    return (
      <div style={style.component}>
          <input ref="input"
                 type="text"
                 value={nbspValue}
                 onFocus={this.props.handleFocus}
                 onBlur={this.props.handleBlur}
                 onChange={this.props.handleChange}
                 placeholder={this.props.placeholder}
                 tabIndex="1"
                 style={style.input}/>
          <div ref="regulator"
               style={style.regulator}>
              {nbspValue}
          </div>
          <div ref="placeholder"
               style={style.regulator}>
              {this.props.placeholder || ""}
          </div>
      </div>
    );
  },

  componentDidMount: function() {
    this.regulateInputWidth();
  },

  componentDidUpdate: function() {
    this.regulateInputWidth();
  },

  regulateInputWidth: function() {
    //After rendering, use regulator widths to determine input width

    var input = this.refs.input.getDOMNode();
    
    var inputWidthGuide;
    if (this.props.value === "") {
      inputWidthGuide = this.refs.placeholder;
    } else {
      inputWidthGuide = this.refs.regulator;
    }
    input.style.width = Util.getDOMNodeComputedStyle(inputWidthGuide, 'width') + "px";
  }
  
});

module.exports = TagInput;