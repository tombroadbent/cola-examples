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

var s_tag = 'MovieNight'
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
      myVote: null,
      yesVotes: 0,
      noVotes: 0,
    }
  },

  componentDidMount: function() {
    log("[componentDidMount]");

    Payload.ensureFirebase(() => {
      Payload.refreshSnapshot(() => {
        this.updateVotes()
      })
    }, () => {
      Payload.refreshSnapshot(() => {
        this.updateVotes()
      })
    })

    this._listener = Payload.addChangeListener(() => { // GOTCHA listen for Firebase to come online then unhook
      this.updateVotes()
    })
  },

  componentWillUnmount: function() {
    log("[componentWillUnmount]")

    this._listener.remove()
    this._listener = null
  },

  participantsChanged: function() {
    log("[participantsChanged]")
    this.updateVotes()
  },

  updateVotes: function() {
    log('[updateVotes]')

    var myVote = null

    var myUserId
    if (Conversation.me && (myUserId = Conversation.me.identifier)) {
      myVote = Payload.getSnapshotValue('participants/' + myUserId + '/vote')
    }

    var yesVotes = 0
    var noVotes = 0
    for (var user of Conversation.participants) {
      var vote
      if ((vote = Payload.getSnapshotValue('participants/' + user.identifier + '/vote'))) {
        if (vote == 'yes') {
          yesVotes += 1
        }
        else if (vote == 'no') {
          noVotes += 1
        }
      }
    }
    this.setState({myVote: myVote, yesVotes: yesVotes, noVotes: noVotes})
  },

  placeVote: function(vote) {
    var myVote = (vote ? 'yes' : 'no')
    log('[placeVote] vote: ' + myVote)

    var myUserId
    if (Conversation.me && (myUserId = Conversation.me.identifier)) {
      Payload.setValue('participants/' + myUserId + '/vote', myVote);
    }
  },

  didLayout: function() {
    log("[didLayout]")
  },

	render: function(state) {
    const movie = this.props.payload.model.movie
		return (
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}} onLayout={this.didLayout}>

        {movie.Poster != 'N/A' ? <Image style={{width: 72, height: 96, marginTop: 2, marginBottom: 2}} resizeMode={Image.resizeMode.contain} source={{uri: movie.Poster}}/> : null}
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', paddingLeft: 8}}>
          <Text style={[this.props.styles.text, {fontSize: 16, fontWeight: '600'}]}>{movie.Title + ' (' + movie.Year + ')'}</Text>
          <Text style={[this.props.styles.text, {fontSize: 14, marginTop: 6}]}>{movie.Rated + ', ' + movie.Runtime}</Text>
          {this.renderButtons()}
          </View>
      </View>
		)
	},
  renderButtons: function () {
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: 20}} onLayout={this.didLayout}>
        {this.renderButton('Yes' + (this.state.myVote ? ' (' + this.state.yesVotes + ')' : ''),
          (this.state.myVote == 'yes' ? styles.buttonHot : styles.buttonNot),
          () => {this.placeVote(true)})}
        {this.renderButton('No' + (this.state.myVote ? ' (' + this.state.noVotes + ')' : ''),
          (this.state.myVote == 'no' ? styles.buttonHot : styles.buttonNot),
          () => {this.placeVote(false)})}
      </View>
    )
  },
  renderButton: function(label, style, action) {
    return (
      <TouchableWithoutFeedback onPress={action}>
        <View style={{flex: 0, justifyContent: 'center', alignItems: 'center', width: 80, height: 40}}>
          <Text style={[this.props.styles.text, style, {fontSize: 18}]}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
})

module.exports = Minimize
