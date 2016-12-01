/**
 * API requests
 * @flow weak
 */
'use strict';

var React = require('react-native');
var { SERVICE_API_KEY } = require('./secrets');

const API_BASE_URL = 'http://www.omdbapi.com';
const ENDPOINT_Search = '?type=movie&s=';
const ENDPOINT_Details = '?type=movie&tomatoes=true&plot=full&i=';

var s_requestId = 1;

var fetchUrl = function(method, url, success, failure) {
	const requestId = s_requestId++;
	console.log(">>> [" + requestId + "] request:" + url)
	fetch(url, {method: method})
	.then(function(response) {
		if (!response.ok) {
			throw new Error("response is not ok")
		}
		else {
			return response.json()
		}
	})
	.then(function(responseJson) {
		console.log("<<< [" + requestId + "] response:" + responseJson.Response)
		if (responseJson.Response == 'True') {
			success(responseJson)
		}
		else {
			failure(responseJson.Error)
		}
	})
	.catch(function(err) {
		console.log("<<< [" + requestId + "] error:" + err)
		failure(err)
	})
}

const requestSearch = function(search, success, failure) {
	const url = API_BASE_URL + ENDPOINT_Search + search + "*"; // HACK apparently star is needed
	return fetchUrl("GET", url, success, failure);
}
const requestDetails = function(movieId, success, failure) {
	const url = API_BASE_URL + ENDPOINT_Details + movieId;
	return fetchUrl("GET", url, success, failure);
}
const requestTrailers = function(movieId, success, failure) {
	const strippedId = movieId.replace('tt', '')
	const url = 'http://api.traileraddict.com/?k=colarmsb&count=4&width=320&imdb=' + strippedId
	const requestId = s_requestId++;
	console.log(">>> [" + requestId + "] request:" + url)
	fetch(url, {method: 'GET'})
	.then(function(response) {
		if (!response.ok) {
			throw new Error("response is not ok")
		}
		else {
			console.log("<<< [" + requestId + "] response:" + response)
			var trailerUrl = response._bodyText.match(/<link>(.*?)<\/link>/).map(function(val) {
				return val.replace(/<\/?link>/g,'');
			});
			var trailerId = response._bodyText.match(/<trailer_id>(.*?)<\/trailer_id>/).map(function(val) {
				return val.replace(/<\/?trailer_id>/g,'');
			});
			success({url: (trailerUrl.length ? trailerUrl[0] : null), id: (trailerId.length ? trailerId[0] : null)})
		}
	})
	.catch(function(err) {
		console.log("<<< [" + requestId + "] error:" + err)
		failure(err)
	})

}

module.exports = {
	requestSearch : requestSearch,
	requestDetails : requestDetails,
	requestTrailers: requestTrailers,
};
