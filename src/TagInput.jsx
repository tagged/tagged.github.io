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
    isFocused: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      value: "",
      placeholder: "",
      tabIndex: 1,
      style: {}
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
        borderColor: this.props.isFocused ? Color.blue500 : Color.blackSecondary,
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
    var {value, isFocused, style, ...inputProps} = this.props;

    // Make spaces count towards computed regulator width
    var nbspValue = value.replace(/ /g, String.fromCharCode(160));

    var style = Util.merge(this.getStyle(), this.props.style);

    //Prevent manual focus and blur
    return (
      <div style={style.component}>
          <input ref="input"
                 type="text"
                 value={nbspValue}
                 style={style.input}
                 {...inputProps}
                 onFocus={function() {console.log('onFocus'); this.shouldRegulateFocus();}.bind(this)}
                 onBlur={function() {console.log('onBlur'); this.shouldRegulateFocus();}.bind(this)}/>
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

  shouldRegulateFocus: function() {
    //Double-regulation was causing a problem in Chrome for Android,
    //where if a focused input was scrolled off the screen, no elements
    //on the screen could be clicked without first blurring the input.

    console.log('just responded to onFocus or onBlur? ', justRespondedToFocusOrBlur);

    if (justRespondedToFocusOrBlur) { console.log('do nothing');
      justRespondedToFocusOrBlur = false;
    }
    else {
      justRespondedToFocusOrBlur = true;
      this.regulateFocus();
    }
  },

  regulateFocus: function() {
    var inputNode = React.findDOMNode(this.refs.input);
    if (this.props.isFocused) { console.log('forcing focus');
      inputNode.focus();
    }
    else { console.log('forcing blur');
      inputNode.blur();
    }
  },

  componentDidMount: function() {console.log('mounting');
    this.regulateInputWidth();
    this.regulateFocus();
  },

  componentDidUpdate: function() {console.log('updating');
    this.regulateInputWidth();
    this.regulateFocus();
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