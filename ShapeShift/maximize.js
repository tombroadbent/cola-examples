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
        <Text style={[styles.text, {fontSize: 28, fontWeight: '500'}]}>Shape Shift</Text>
			</View>
    )
  }
})

module.exports = Maximize
