import {EventEmitter} from 'events';

import AppDispatcher from '../events/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import Config from '../config/Config';
import PodTree from '../structs/PodTree';
import {
  KUBERNETES_POD_CHANGE,
	KUBERNETES_POD_CREATE_ERROR,
	KUBERNETES_POD_CREATE_SUCCESS,
	KUBERNETES_POD_FETCH_SUCCESS
} from '../constants/EventTypes';
var KubernetesActions = require('../events/KubernetesActions');

let requestInterval;

function startPolling() {
  if (!requestInterval) {
    KubernetesActions.fetchPods();
    requestInterval = global.setInterval(
      KubernetesActions.fetchPods,
      Config.getRefreshRate()
    );
  }
}

function stopPolling() {
  if (requestInterval) {
    global.clearInterval(requestInterval);
    requestInterval = null;
  }
}

class KubernetesStore extends EventEmitter {
  constructor() {
    super(...arguments);

    this.data = {
      pod: {},
      podTree: {id: '/', items: []}
    };

    this.dispatcherIndex = AppDispatcher.register((payload) => {
      if (payload.source !== ActionTypes.SERVER_ACTION) {
        return false;
      }

      var action = payload.action;
      switch (action.type) {
        case ActionTypes.REQUEST_KUBERNETES_POD_CREATE_ERROR:
          this.emit(KUBERNETES_POD_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_CREATE_SUCCESS:
          this.data.podTree = action.data;
          this.emit(KUBERNETES_POD_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_FETCH_SUCCESS:
          this.data.pod = action.data;
          this.emit(KUBERNETES_POD_FETCH_SUCCESS);
      }

      return true;
    });
  }

  addChangeListener(eventName, callback) {
    this.on(eventName, callback);

    // Start polling if there is at least one listener
    if (this.shouldPoll()) {
      startPolling();
    }
  }

  removeChangeListener(eventName, callback) {
    this.removeListener(eventName, callback);

    // Stop polling if no one is listening
    if (!this.shouldPoll()) {
      stopPolling();
    }
  }

  shouldPoll() {
    return !!this.listeners(KUBERNETES_POD_CHANGE).length;
  }

  createPod() {
    console.log('Staring to create Pod');
    return KubernetesActions.createPod(...arguments);
  }

  getPod() {
    console.log('Get a Pod');
    KubernetesActions.getPod(...arguments);
    return this.data.pod;
    // return KubernetesActions.getPod(...arguments);
  }

  get podTree() {
    return new PodTree(this.data.podTree);
  }

  get storeID() {
    return 'kubernetes';
  }
}

module.exports = new KubernetesStore();
