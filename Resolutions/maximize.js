/**
 * Full screen display for Movie Bubble
 * @flow weak
 */
'use strict';

const React = require('react');
var {
  StyleSheet,
  Text,
  View,
} = require('react-native');

var {
  Bubble
} = require('cola-api');

var Maximize = React.createClass({

  componentDidMount: function() {
    console.log("componentDidMount");
  },

  componentWillUnmount: function() {
    console.log("componentWillUnmount");
  },

  didLayout: function() {
    console.log("didLayout");
  },

  render: function() {
    const itemInfo = this.props.payload.model
		return (
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 40}} onLayout={this.didLayout}>
        <Text style={[this.props.styles.text, {fontSize: 18, fontWeight: '600'}]}>{itemInfo.itemTitle} (${itemInfo.itemPrice})</Text>
        <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '400'}]}>{itemInfo.itemDescription}</Text>
        <View style={{height: 20}}/>
        <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '600'}]}>Resolution:</Text>
        <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '800'}]}>{this.state.answer}</Text>
      </View>
    )
  }
});

module.exports = Maximize;
