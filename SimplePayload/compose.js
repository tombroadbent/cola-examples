// @flow weak
'use strict'

const React = require('react')
var {
  ScrollView,
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
    }, 1000)
  },

  componentWillUnmount: function() {
  },

	render: function() {

		return (
      <ScrollView style={{flex: 1, flexDirection: 'column'}} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'stretch'}}>
        <Text style={this.props.styles.text}>Simple Payload</Text>
      </ScrollView>
      )
	}
})

module.exports = Compose
