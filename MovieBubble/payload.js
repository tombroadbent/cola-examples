/**
 * Copyright (c) 2015 Cola, Inc. All rights reserved.
 * All rights reserved.
 *
 * @providesModule Payload
 * @flow weak
 */

'use strict';

var EventEmitter = require('EventEmitter');
var NativeModules = require('NativeModules');
var NativePayload = NativeModules.Payload;
var BatchedBridge = require('BatchedBridge');

var Snapshot = {};

var Emitter = new EventEmitter();

var Payload = {

  getSnapshotValue: function(path :string) {
    var node = Snapshot
    let p
    for (p of path.split('/')) {
        if (!(node = node[p])) {
          break;
        }
    }
    return node
  },

  getValue: function(path :string, callback) {
    NativePayload.getValue(path, callback)
  },

  setValue: function(path :string, value :?Object) :void {
    NativePayload.setValue(path, value);
  },

  _update: function(snapshot) {
    console.log('[Payload] _update')
    Snapshot = snapshot;
    Emitter.emit('change');
  },

  addChangeListener: function(handler: Function) {
    return Emitter.addListener('change', handler);
  },

  ensureFirebase: function(online, offline) {
    NativePayload.ensureFirebase(online, offline)
  },

  refreshSnapshot: function(callback) {
    NativePayload._getAll((snapshot) => {
      console.log('[Payload] _getAll')
      Snapshot = snapshot || {}
      callback()
    });
  }

}


BatchedBridge.registerCallableModule('Payload', Payload);

module.exports = Payload;
