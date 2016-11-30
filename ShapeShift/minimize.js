// @flow weak
'use strict'

const React = require('react')
var {
  Text,
  View
} = require('react-native')
import TimerMixin from 'react-timer-mixin'

var {
  Bubble
} = require('cola-api')

var Minimize = React.createClass({
  mixins: [TimerMixin],
  _timeout: (null :Object),

  getInitialState: function() {
    return {size: {width: 0, height: 0}};
  },

  onLayout: function(event) {
    var {x, y, width, height} = event.nativeEvent.layout

    if (this._timeout) {
      this.clearTimeout(this._timeout)
    }
    this._timeout = this.setTimeout(() => {
      var off = (height < 200 ? 10 : -80)
      this.setState({ size: {width: width, height: height+off} }, () => {
        Bubble.setPreferredSize(this.state.size.width, this.state.size.height)
      })
    }, 500)
  },

	render: function() {

		return (
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}} onLayout={this.onLayout}>
				<Text style={[this.props.styles.text, {textAlign: 'center', fontSize: 16, marginTop: 20}]}>Size: {JSON.stringify(this.state.size)}</Text>
			</View>
		)
	}
})

module.exports = Minimize
