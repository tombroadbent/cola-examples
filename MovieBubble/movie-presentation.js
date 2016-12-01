/**
 * Compose screen for Movie Bubble
 * @flow weak
 */
'use strict';

const React = require('react');
var {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableWithoutFeedback,
} = require('react-native');
const WebView = require('WebView');
const Linking = require('Linking');

var MoviePresentation = React.createClass({
  getDefaultProps: function() {
    return {}
  },
  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

	render: function() {
    const movie = this.props.movie
    const trailer = this.props.trailer
    const posterUrl = movie.Poster
    console.log("poster:" + posterUrl)

		return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
          {posterUrl != 'N/A' ? <Image style={{width: 180, height: 240}} resizeMode={Image.resizeMode.contain} source={{uri: posterUrl}}/> : null}
          <View style={{flex: 1, flexDirection: 'column', padding: 8}}>
            <Text style={{fontSize: 20}}>{movie.Title + ' (' + movie.Year + ')'}</Text>
            <Text style={{fontSize: 16, marginTop: 6}}>{movie.Rated + ', ' + movie.Runtime}</Text>
            {this.renderLink("Go to Movie", movie.Website)}
          </View>
        </View>

        <View style={{padding: 20}}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: 'gray'}}>Plot</Text>
          <Text style={{fontSize: 12}}>{movie.Plot}</Text>
          {this.renderLink("Go to IMDB", 'http://www.imdb.com/title/' + movie.imdbID)}
        </View>

        {((movie) => {
          if (movie.tomatoURL.length && movie.tomatoURL != 'N/A') {
            return (
              <View style={{padding: 20}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'gray'}}>Review ({movie.tomatoMeter + '/100, ' + movie.tomatoRating})</Text>
                <Text style={{fontSize: 12}}>{movie.tomatoConsensus}</Text>
                {this.renderLink("Go to Rotten Tomatoes", movie.tomatoURL)}
              </View>
            )
          }
        })(movie)}

        <View style={{flex: 0, flexDirection: 'column', alignItems: 'center', padding: 10}}>

        {trailer && trailer.id ? (
          <WebView style={{width: 320, height: 180}} source={{uri: 'http://v.traileraddict.com/' + trailer.id}}/>
        ) : null}
        {trailer && trailer.url ? this.renderLink("Go to Trailer Addict", trailer.url) : null}

        </View>

      </ScrollView>
      );
	},
  renderLink: function(label, url) {
    if (!url || !url.length || url == 'N/A') return

    return (
      <View style={{marginTop: 4, marginBottom: 4}}>
        <TouchableWithoutFeedback onPress={ () => Linking.openURL(url) }>
          <View>
            <Text style={{fontSize: 13, color: 'blue'}}>{label}&gt;&gt;</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

});

module.exports = MoviePresentation;
