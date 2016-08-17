// @flow weak
'use strict'

const React = require('react')
var {
  Text,
  View
} = require('react-native')


var Minimize = React.createClass({

  didLayout: function() {
    console.log('[didLayout]')
  },

	render: function() {

		return (
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}} onLayout={this.didLayout}>
        <Text style={[this.props.styles.text, {textAlign: 'center', fontSize: 18, marginTop: 10}]}>Payload:</Text>
        <Text style={[this.props.styles.text, {textAlign: 'center', fontSize: 12, marginTop: 10}]}>{JSON.stringify(this.props.payload)}</Text>
			</View>
		)
	}
})

module.exports = Minimize
