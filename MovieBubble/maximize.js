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

const MoviePresentation = require('./movie-presentation');

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
    const model = this.props.payload.model
    return (
      <MoviePresentation movie={model.movie} trailer={model.trailer}/>
    );
  }
});

module.exports = Maximize;
