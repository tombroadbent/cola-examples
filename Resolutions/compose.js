/**
 * Compose screen for Movie Bubble
 * @flow weak
 */
'use strict';

const React = require('react');
var {
  StyleSheet,
  View,
  ScrollView,
  ListView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
} = require('react-native');
const Navigator = require('Navigator')

import TimerMixin from 'react-timer-mixin';

var {
  Bubble
} = require('cola-api');


var Layouts = StyleSheet.create({
   screen: {
      flex: 1,
      flexDirection: 'column',
   },

   container: {
      flexDirection: 'column',
      justifyContent: 'flex-start'
   },
});

var Compose = React.createClass({
  mixins: [TimerMixin],
  model: ([]: Array<Object>),


  getInitialState: function() {
    return {
      itemTitle: null,
      itemDescription: null,
      itemPrice: null,
    };
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  updateSendState: function() {
    Bubble.setSendEnabled(!!(this.state.itemTitle && this.state.itemPrice));
    this.props.callback(this.state)
  },

  promptText: function() {
    var text
    if (this.state.error) {
      text = this.state.error
    }
    else if (this.state.isRequesting) {
      text = "Requesting.."
    }
    else if (this.model.length) {
      text = (!this.state.movie ? "Tap a movie to select.." : "Tap a movie to change selection..")
    }
    else if (this.currSearch && this.currSearch.length) {
      text = (this.currSearch.length < 2 ? "Keep typing.." : "No results; try another search..")
    }
    else {
      text = "Search for a movie.."
    }

    return text
  },

  onChangeItemTitleText: function(text) {
    this.setState({itemTitle: text})
    this.updateSendState()
  },
  onChangeItemDescriptionText: function(text) {
    this.setState({itemDescription: text})
    this.updateSendState()
  },
  onChangeItemPriceText: function(text) {
    this.setState({itemPrice: text})
    this.updateSendState()
  },

  render: function() {
    return (

      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{fontSize: 16, color: 'darkgray', paddingLeft: 10, marginTop: 8, marginBottom: 8}}>Title:</Text>
        <TextInput
          style={{height: 40, fontSize: 20, color: '#404040', backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, paddingLeft: 10}}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.onChangeItemTitleText(text)}
        />

      <Text style={{fontSize: 16, color: 'darkgray', paddingLeft: 10, marginTop: 8, marginBottom: 8}}>Description:</Text>
        <TextInput
          style={{height: 40, fontSize: 20, color: '#404040', backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, paddingLeft: 10}}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.onChangeItemDescriptionText(text)}
        />

      <Text style={{fontSize: 16, color: 'darkgray', paddingLeft: 10, marginTop: 8, marginBottom: 8}}>Price: (USD)</Text>
        <TextInput
          style={{height: 40, fontSize: 20, color: '#404040', backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, paddingLeft: 10}}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.onChangeItemPriceText(text)}
        />

      </View>
      )
	},

});

module.exports = Compose;
