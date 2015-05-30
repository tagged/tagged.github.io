var React = require('react');
var Dimension = require('./res/dimension');

//Major (only?) role: styling
var Search = React.createClass({
  
  propTypes: {
    fileNodes: React.PropTypes.array,
    searchTagNodes: React.PropTypes.array,
    searchInputNode: React.PropTypes.element,
    suggestedTagNodes: React.PropTypes.array,
    suggestionTitleNode: React.PropTypes.element,
  },

  getStyle: function() {
    return {
      search: {
        paddingTop: 3 * Dimension.space,
        paddingBottom: Dimension.space
      },
      editor: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
      },
      suggestions: {
        paddingLeft: Dimension.marginMobile,
        paddingRight: Dimension.marginMobile,
        paddingTop: Dimension.space
      }
    };
  },

  render: function() {

    var style = this.getStyle();
    
    return(
      <div>

          <div style={style.search}>
              <div style={style.editor}>
                  {this.props.searchTagNodes}
                  {this.props.searchInputNode}
              </div>
              <div>
                  {this.props.suggestionTitleNode}
                  <div style={style.suggestions}>
                      {this.props.suggestedTagNodes}
                  </div>
              </div>
          </div>

          {this.props.fileNodes}

      </div>
    );
  }

});

module.exports = Search;