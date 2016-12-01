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
  ListView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
} = require('react-native');
const Navigator = require('Navigator')

import TimerMixin from 'react-timer-mixin';

var {
  Bubble
} = require('cola-api');

var MoviePresentation = require('./movie-presentation');

var {
  requestSearch,
  requestDetails,
  requestTrailers,
} = require('./requests');

var Layouts = StyleSheet.create({
   screen: {
      flex: 1,
      flexDirection: 'column',
   },

   container: {
      flexDirection: 'column',
      justifyContent: 'flex-start'
   },
});

var Compose = React.createClass({
  mixins: [TimerMixin],
  navigator: (null: Navigator),
  model: ([]: Array<Object>),
  currSearch: null,
  nextSearch: null,
  timeout: null,

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      movie: null,
      trailer: null,
      error: null,
    };
  },

  resetModel: function() {
    this.setModel([])
  },
  setModel: function(model) {
    this.model = model;

    const rows = []
    if (model) {
      model.sort(function(a,b) {
        return (a.Title != b.Title ? (a.Title < b.Title ? -1 : 1) : a.Year != b.Year ? (a.Year < b.Year ? -1 : 1) : 0)
      })

      for (const m of model) {
        console.log(m)
        rows.push(m.Title + " (" + m.Year + ")")
      }
    }

    this.setState({ dataSource: this.state.dataSource.cloneWithRows(rows) })
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  showSearch: function() {
    console.log('[showSearch]')
    this.navigator.popToTop()
    this.setState({ movie: null, trailer: null })
    Bubble.setSendEnabled(false);
  },

  showMovie: function(movieId) {
    console.log('[showMovie]')
    this.navigator.push({id: 'movie'})

    console.log("requesting..")
    this.setState({ movie: null, error: null, isRequesting: true })

    requestDetails(movieId, (response) => {
      const movie = response
      console.log(JSON.stringify(movie))
      this.setState({ movie: movie, error: null, isRequesting: false })
      this.props.callback({movie: this.state.movie, trailer: this.state.trailer})
      Bubble.setSendEnabled(true);

    }, (error) => {
      console.log(error)
      this.setState({ error: error, isRequesting: false })
    })

    requestTrailers(movieId, (trailer) => {
      console.log("trailers: ", JSON.stringify(trailer))
      this.setState({ trailer: trailer })
      this.props.callback({movie: this.state.movie, trailer: this.state.trailer})
    }, (error) => {
      console.log(error)
      this.setState({ trailer: null })
    })
  },

  searchWithText: function(text, completion) {
    text = text.trim()
    if (this.state.isRequesting) {
      console.log("updating nextSearch was: " + this.nextSearch + "; now: " + text)
      this.nextSearch = text
      return
    }

    this.currSearch = text
    this.nextSearch = null
    console.log("searching:" + text)
    this.setState({ isRequesting: true })
    this.resetModel()

    requestSearch(text, (response) => {
      console.log(JSON.stringify(response))
      this.setState({ isRequesting: false })
      completion(response)
    }, (error) => {
      console.log(error);
      this.setState({ isRequesting: false })
      completion(null)
    })
  },

  searchComplete: function(response) {
    if (!response) {
      this.resetModel()
    }
    else {
      this.setModel(response.Search)
    }

    if (this.nextSearch) {
      console.log("nextSearch: " + this.nextSearch + "; will search again..");
      this.searchWithText(this.nextSearch, this.searchComplete)
    }
  },

  promptText: function() {
    var text
    if (this.state.error) {
      text = this.state.error
    }
    else if (this.state.isRequesting) {
      text = "Requesting.."
    }
    else if (this.model.length) {
      text = (!this.state.movie ? "Tap a movie to select.." : "Tap a movie to change selection..")
    }
    else if (this.currSearch && this.currSearch.length) {
      text = (this.currSearch.length < 2 ? "Keep typing.." : "No results; try another search..")
    }
    else {
      text = "Search for a movie.."
    }

    return text
  },

  onChangeText: function(text) {
    if (text.length < 2) {
      this.resetModel()
    }
    else {
      if (this.timeout) {
        this.clearTimeout(this.timeout)
      }
      this.timeout = this.setTimeout(() => {
        this.timeout = null
        this.searchWithText(text, this.searchComplete)
      }, 1000)
    }
  },

  onTapRow: function(rowData, rowId) {

    const movieResult = this.model[rowId]
    console.log("tapped:" + rowData)
    console.log("item:" + JSON.stringify(movieResult))

    this.showMovie(movieResult.imdbID)
  },
  onNavTrans: function() {
    console.log('[onNavTrans] routes: ' + (this.navigator ? this.navigator.getCurrentRoutes().length : 0))
  },

  render: function() {
    return (
      <Navigator ref={(ref) => this.navigator = ref}
        style={{flex: 1}}
        initialRoute={{id: 'search'}}
        configureScene={() => Navigator.SceneConfigs.PushFromRight}
        renderScene={this.renderScene}
        onDidFocus={this.onNavTrans}/>
    )
  },
  renderScene: function(route, navigator) {
    console.log('[renderScene] route: ' + route.id)

    var render = null

    switch (route.id) {
      case 'search':
        render = this.renderSearch(route, navigator)
        break

      case 'movie':
        render = this.renderMovie(route, navigator)
        break

      default:
        console.log('[renderScene] unrecognized route: ' + route.id)
        break
    }

    if (!render) {
      console.log('[renderScene] render is empty for route: ' + route.id)
    }

    return render
  },
	renderSearch: function(route, navigator) {

		return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{fontSize: 16, color: 'darkgray', paddingLeft: 10, marginTop: 8, marginBottom: 8}}>{this.promptText()}</Text>
        <TextInput
          style={{height: 40, fontSize: 20, color: '#404040', backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, paddingLeft: 10}}
          clearButtonMode='while-editing'
          onChangeText={(text) => this.onChangeText(text)}
        />

        <ListView
          style={{backgroundColor: '#F0F0F0'}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          scrollEnabled={true}
          enableEmptySections={true}
        />
      </View>
      )
	},
  renderMovie: function (route, navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: 'white'}}>
        {this.renderBackButton(navigator)}
        {this.state.movie ? <MoviePresentation movie={this.state.movie} trailer={this.state.trailer}/> : <View/>}
      </View>
    )
  },
  renderRow: function (rowData, sectionId, rowId) {
    return (
      <TouchableHighlight onPress={() => this.onTapRow(rowData, rowId)} underlayColor='gray' style={{marginTop: 2}}>
        <View style={{backgroundColor: 'white'}}>
          <Text style={{fontSize: 18, color: '#505050', margin: 8}}>{rowData}</Text>
        </View>
      </TouchableHighlight>
    )
  },
  renderBackButton: function(navigator) {
    return this.renderButton({title: 'Back', action: () => {this.showSearch()}, enable: true})
  },
  renderButton: function(button) {
    if (!button) return null

    return (
      <TouchableWithoutFeedback onPress={button.enable ? button.action : null}>
        <View style={{flex: 0, alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', height: 60, backgroundColor: 'darkgray'}}>
          <Text style={{flex: 0, textAlign: 'center', fontSize: 21, fontWeight: '400', color: 'white', paddingHorizontal: 8}}>{button.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

});

module.exports = Compose;
