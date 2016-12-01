// @flow weak
'use strict'

const React = require('react')
var {
  Dimensions,
  View,
  Text
} = require('react-native')
import TimerMixin from 'react-timer-mixin'

var {
  Bubble
} = require('cola-api')

var Compose = React.createClass({
  mixins: [TimerMixin],

  componentDidMount: function() {
    this.setTimeout(() => {
      Bubble.setSendEnabled(true)
    }, 200)
  },

  componentWillUnmount: function() {
  },

	render: function() {

		return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', margin: 10}}>
        <Text style={this.props.styles.text, {fontSize: 28}}>Shape Shifter</Text>
      </View>
      )
	}
})

module.exports = Compose
