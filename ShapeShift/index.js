// @flow weak
'use strict'

const React = require('react')
var {
  AppRegistry,
  StyleSheet,
  View,
} = require('react-native')

var { Bubble } = require('cola-api')

var Compose = require('./compose.js')
var Minimize = require('./minimize.js')
var Maximize = require('./maximize.js')

var MyBubble = Bubble.createBubbleClass({

  bubbleSetupDidComplete: function(completion) {
    console.log('[bubbleSetupDidComplete]')
    completion({ initialLayout: {ratio: 16/9} })
  },

  componentDidMount: function() {
    console.log('[componentDidMount]')
  },

  componentWillUnmount: function() {
    console.log('[componentWillUnmount]')
  },

  render: function() {
    console.log('render')
    const mode = this.props[Bubble.BUBBLE_MODE]
    const styles = Bubble.createStyleSheet(mode)

    switch (mode) {
  		case Bubble.BUBBLE_SETUP_MODE:
	  		return (<Compose styles={styles}/>)

	  	case Bubble.BUBBLE_OUTGOING_MODE:
	  	case Bubble.BUBBLE_INCOMING_MODE:
	  		return (<Minimize payload={this.props.initial} styles={styles}/>)

	  	case Bubble.BUBBLE_FULL_OUTGOING_MODE:
	  	case Bubble.BUBBLE_FULL_INCOMING_MODE:
	  		return (<Maximize payload={this.props.initial} styles={styles}/>)
  	}
  }
})
