/**
 * Compose screen for Movie Bubble
 * @flow weak
 */
'use strict';

const React = require('react')
var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
} = require('react-native')

var {
	Bubble,
	Conversation,
  Participant,
} = require('cola-api')

const Payload = require('./payload')

var s_tag = 'Resolutions'
const log = function(s) {
  console.log((s_tag != 'unk' ? '(' + s_tag + ') ' : '') + s)
}

const styles = StyleSheet.create({
  buttonHot: {
    fontWeight: '600'
  },
  buttonNot: {
    fontWeight: '400'
  }
})

var Minimize = React.createClass({
  _listener: (null: ?Object),

  getInitialState: function() {
    return {
      answer: null,
    }
  },

  componentDidMount: function() {
    log("[componentDidMount]");

    Payload.ensureFirebase(() => {
      Payload.refreshSnapshot(() => {
        this.updateAnswer()
      })
    }, () => {
      Payload.refreshSnapshot(() => {
        this.updateAnswer()
      })
    })

    this._listener = Payload.addChangeListener(() => { // GOTCHA listen for Firebase to come online then unhook
      this.updateAnswer()
    })
  },

  componentWillUnmount: function() {
    log("[componentWillUnmount]")

    this._listener.remove()
    this._listener = null
  },

  participantsChanged: function() {
    log("[participantsChanged]")
  },

  updateAnswer: function() {
    log('[updateAnswer]')

    var answer = Payload.getSnapshotValue('group/answer')
    this.setState({answer: answer})
  },

  placeAnswer: function(answerBool) {
    var answer = (answerBool ? 'accept' : 'reject')
    log('[placeAnswer] vote: ' + answer)
    Payload.setValue('group/answer', answer);
    //Bubble.sendMinorNotificationText(Conversation.me.shortName + ' voted ' + myVote)
    this.setState({answer: answer})
  },

  didLayout: function() {
    log("[didLayout]")
  },

	render: function(state) {
    console.log("[render]: " + JSON.stringify(this.props.payload))

    const itemInfo = this.props.payload.model
		return (
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}} onLayout={this.didLayout}>
        <Text style={[this.props.styles.text, {fontSize: 18, fontWeight: '600'}]}>{itemInfo.itemTitle} (${itemInfo.itemPrice})</Text>
        <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '400'}]}>{itemInfo.itemDescription}</Text>
        <View style={{height: 20}}/>
        {this.state.answer ? this.renderAnswer() : this.renderButtons()}
      </View>
		)
	},
  renderAnswer: function() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '600'}]}>Resolution:</Text>
        <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '800'}]}>{this.state.answer}</Text>
      </View>
    )
  },
  renderButtons: function () {
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: 20}}>
        {this.renderButton('Ok', () => {this.placeAnswer(true)})}
        {this.renderButton('Nope', () => {this.placeAnswer(false)})}
      </View>
    )
  },
  renderButton: function(label, action) {
    return (
      <TouchableWithoutFeedback onPress={action}>
        <View style={{flex: 0, justifyContent: 'center', alignItems: 'center', width: 80, height: 40}}>
          <Text style={[this.props.styles.text, {fontSize: 18, fontWeight: '600'}]}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
})

module.exports = Minimize
