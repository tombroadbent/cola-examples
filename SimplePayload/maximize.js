// @flow weak
'use strict'

const React = require('react')
var {
  Text,
  View,
} = require('react-native')

var Maximize = React.createClass({

  render: function() {
    const styles = this.props.styles

    return (
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={[styles.text, {fontSize: 24, fontWeight: '500', padding: 8}]}>Payload:</Text>
        <Text style={[styles.text, {fontSize: 14, fontWeight: '600', padding: 8}]}>{JSON.stringify(this.props.payload)}</Text>
			</View>
    )
  }
})

module.exports = Maximize
