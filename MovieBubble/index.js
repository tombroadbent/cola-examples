/**
 * Movie Bubble
* @flow weak
*/
'use strict';

const React = require('react');
var {
  AppRegistry,
  StyleSheet,
  View,
} = require('react-native');

var { Bubble } = require('cola-api');

var Compose = require('./compose');
var Minimize = require('./minimize');
var Maximize = require('./maximize');

const style = StyleSheet.create({
  screen : {
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'stretch',
      justifyContent: 'flex-end',
  }
})

var MovieBubble = Bubble.createBubbleClass({
  model: null,

  getDefaultProps: function() {
    console.log("getDefaultProps");
    return {
        default: {payloadState: "default"}
    };
  },

  getInitialState: function() {
    console.log("getInitialState");
    return {payload: (Object.keys(this.props.initial).length ? this.props.initial : this.props.default)}; // GOTCHA initial will only exist when Bubble is received (not composed and sent); also appears initial is _never_ null, so check size
  },

  bubbleComposeCallback: function(model) {
    console.log("bubbleComposeCallback:" + JSON.stringify(model))
    this.model = model
  },
  bubbleSetupDidComplete: function(completion) {
    console.log("bubbleSetupDidComplete");
    completion({payloadState: "immutable", model: this.model});
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  render: function() {
    const mode = this.props[Bubble.BUBBLE_MODE];
    const styles = Bubble.createStyleSheet(mode);

    switch (mode) {
  		case Bubble.BUBBLE_SETUP_MODE:
	  		return (<Compose payload={this.state.payload} callback={this.bubbleComposeCallback} styles={styles}/>)

	  	case Bubble.BUBBLE_OUTGOING_MODE:
	  	case Bubble.BUBBLE_INCOMING_MODE:
	  		return (<Minimize payload={this.props.initial} styles={styles}/>)

	  	case Bubble.BUBBLE_FULL_OUTGOING_MODE:
	  	case Bubble.BUBBLE_FULL_INCOMING_MODE:
	  		return (<Maximize payload={this.props.initial} styles={styles}/>);
  	}
  }
});
