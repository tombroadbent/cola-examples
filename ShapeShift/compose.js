// @flow weak
'use strict'

const React = require('react')
var {
  Dimensions,

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
    }, 200)
  },

  componentWillUnmount: function() {
  },

	render: function() {

		return (
      <ScrollView style={{flex: 1, flexDirection: 'column'}} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'stretch'}}>
        <Text style={this.props.styles.text}>Shape Shifter</Text>
      </ScrollView>
      )
	}
})

module.exports = Compose
