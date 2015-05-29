var React = require('react/addons');
var TagSearchEditor = require('./TagSearchEditor');
var TagSearchSuggestions = require('./TagSearchSuggestions');
var Color = require('./res/color');
var Dimension = require('./res/dimension');
var Typography = require('./res/typography');
var Util = require('./util/util');

var Set = require('collections/set');
var SortedSet = require('collections/sorted-set');

var _Files = require('./res/_files');
var _Tags = require('./res/_tags');


//Eventually move to database logic


var MakeTagObjects = function(tags, searchTags) {
  //Convert ["tag1","tag2",...]
  //To [{text:"tag1",isDisabled:false},{text:"tag2",isDisabled:true},...]
  var tagObjects = tags.map(function(tag) {
    return {
      isDisabled: searchTags.indexOf(tag) >= 0,
      text: tag
    };
  });
  return tagObjects;
};


var MakeSuggestion = function(searchValue, searchTags) {
  //Make tag suggestions based on search value and search tags

  var suggestedTags;

  if (searchTags.length === 0) {

    if (searchValue === "") {
      //All tags
      suggestedTags = _Tags;
    } else {
      //All tags starting with search value
      suggestedTags = _Tags.filter(function(tag) {
        return tag.indexOf(searchValue) === 0;
      });
    }

  } else {

    //Tags on files containing all search tags AND start with search value (empty string starts every string)
    suggestedTags = SortedSet();
    searchTagSet = Set(searchTags);
    for (var i = 0; i < _Files.length; i++) {
      var fileTags = Set(_Files[i].tags);
      if (searchTagSet.intersection(fileTags).length === searchTagSet.length) { 
        //If file contains all search tags,
        //get all file tags that start with search value
        matchingFileTags = fileTags.filter(function(tag) {
          return tag.indexOf(searchValue) === 0;
        });
        //Exclude existing search tags (we're refining)
        matchingFileTags = matchingFileTags.difference(searchTagSet);
        //Merge into suggested tags
        suggestedTags = suggestedTags.union(matchingFileTags);
      }
    }
    suggestedTags = suggestedTags.toArray();

  }
  
  return MakeTagObjects(suggestedTags, searchTags);

};

    
var LabelSuggestion = function(searchValue, searchTags, suggestedTags) {
  //Determine subheader label from search tags, input value, and number of suggested tags
  var haveSuggestedTags = suggestedTags.length > 0;
  var label;
  if (searchValue === "") {
    if (searchTags.length === 0) {
      label = haveSuggestedTags ? "All " + suggestedTags.length + " tags" : "No tags exist yet";
    } else {
      label = haveSuggestedTags ? "Refine search" : "No tags to refine search";
    }
  } else {
    if (searchTags.length === 0) {
      label = haveSuggestedTags ? ('"' + searchValue + '" tags') : ('No "' + searchValue + '" tags');
    } else {
      label = haveSuggestedTags ? ('"' + searchValue + '" tags to refine search') : ('No "' + searchValue + '" tags to refine search');
    }
  }
  return label;
};





var TagSearch = React.createClass({

  propTypes: {
    searchTags: React.PropTypes.array,
    searchValue: React.PropTypes.string.isRequired,
    addSearchTag: React.PropTypes.func.isRequired,
    deleteSearchTag: React.PropTypes.func.isRequired,
    isFocused: React.PropTypes.bool.isRequired,
    handleFocus: React.PropTypes.func.isRequired,
    handleBlur: React.PropTypes.func.isRequired,
    handleChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      searchTags: []
    };
  },
  
  getStyle: function() {    
    return {
      component: {
        paddingTop: 3 * Dimension.space,
        paddingBottom: Dimension.space
      },
    };
  },

  getTagSearchEditorProps: function(){
    return {
      searchTags: this.props.searchTags,
      searchValue: this.props.searchValue,
      deleteSearchTag: this.props.deleteSearchTag,
      isFocused: this.props.isFocused,
      handleFocus: this.props.handleFocus,
      handleBlur: this.props.handleBlur,
      handleChange: this.props.handleChange
    };
  },

  getTagSearchSuggestionsProps: function(){
    var suggestedTags = MakeSuggestion(this.props.searchValue, this.props.searchTags);
    var title = LabelSuggestion(this.props.searchValue, this.props.searchTags, suggestedTags);
    return {
      suggestedTags: suggestedTags,
      title: title,
      addSearchTag: this.props.addSearchTag
    };
  },

  render: function() {
    var style = this.getStyle();

    // Show tag search suggestions only if search editor is focused
    var tagSearchSuggestions = this.props.isFocused ? (
      <TagSearchSuggestions {...this.getTagSearchSuggestionsProps()}/>
    ) : null;

    return (
      <div style={style.component}>
          <TagSearchEditor {...this.getTagSearchEditorProps()}/>
          {tagSearchSuggestions}
      </div>
    );
  }
  
});

module.exports = TagSearch;