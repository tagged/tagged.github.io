var React = require('react/addons');
var R = require('./res/index');
var Color = R.color;
var Dimension = R.dimension;
var Typography = R.typography;
var Util = require('./util/util');

//Just called regulateFocus *because of onFocus or onBlur*
var justRespondedToFocusOrBlur = false;

var TagInput = React.createClass({
  //Single line of text
  //Grows with user input

  propTypes: {
    value: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      value: "",
      style: {},
      placeholder: "",
      tabIndex: 1,
    };
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
        borderColor: Color.blackSecondary,
        borderRadius: Dimension.borderRadius,
        paddingLeft: Dimension.space,
        paddingRight: Dimension.space,
        font: 'inherit',
        lineHeight: Typography.lineHeight,
        paddingTop: verticalPadding - Dimension.borderWidth,
        paddingBottom: verticalPadding - Dimension.borderWidth,
        color: Color.blackPrimary,
        minWidth: 1
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
    //Extract props, and pass the rest to input
    //onClick, onKeyUp, onKeyDown, onChange, placeholder, tabIndex, ...
    var {value, style, ...inputProps} = this.props;

    // Make spaces count towards computed regulator width
    var nbspValue = value.replace(/ /g, String.fromCharCode(160));

    var style = Util.merge(this.getStyle(), style);

    return (
      <div style={style.component}>
          <input ref="input"
                 type="text"
                 value={nbspValue}
                 style={style.input}
                 {...inputProps}/>
          <div ref="regulator"
               style={style.regulator}>
              {nbspValue}
          </div>
          <div ref="placeholder"
               style={style.regulator}>
              {this.props.placeholder}
          </div>
      </div>
    );
  },

  focus: function() {
    React.findDOMNode(this.refs.input).focus();
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
  },

  
  
});

module.exports = TagInput;