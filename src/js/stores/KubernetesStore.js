import {EventEmitter} from 'events';

import AppDispatcher from '../events/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import Config from '../config/Config';
import PodTree from '../structs/PodTree';
import PVTree from '../structs/PVTree';
import PVCTree from '../structs/PVCTree';
import {
  KUBERNETES_CHANGE,
} from '../constants/EventTypes';
var KubernetesActions = require('../events/KubernetesActions');

let requestInterval;

function fetchKubernetes() {
  KubernetesActions.fetchPods();
  KubernetesActions.fetchPVs();
  KubernetesActions.fetchPVCs();
}

function startPolling() {
  if (!requestInterval) {
    fetchKubernetes();
    requestInterval = global.setInterval(
      fetchKubernetes,
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
      pv: {},
      pvc: {},
      podTree: {id: '/', items: []},
      pvTree: {id: '/', items: []},
      pvcTree: {id: '/', items: []}
    };

    this.dispatcherIndex = AppDispatcher.register((payload) => {
      if (payload.source !== ActionTypes.SERVER_ACTION) {
        return false;
      }

      var action = payload.action;
      switch (action.type) {
        case ActionTypes.REQUEST_KUBERNETES_POD_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_POD_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_CREATE_SUCCESS:
          this.data.podTree = action.data;
          this.emit(EventTypes.KUBERNETES_POD_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_POD_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_FETCH_SUCCESS:
          this.data.pod = action.data;
          this.emit(EventTypes.KUBERNETES_POD_FETCH_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_PODS_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_SUCCESS:
          this.data.podTree = action.data;
          this.emit(EventTypes.KUBERNETES_PODS_FETCH_SUCCESS);
          break;

        case ActionTypes.REQUEST_KUBERNETES_PV_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_PV_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PV_CREATE_SUCCESS:
          this.data.pvTree = action.data;
          this.emit(EventTypes.KUBERNETES_PV_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PV_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_PV_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PV_FETCH_SUCCESS:
          this.data.pv = action.data;
          this.emit(EventTypes.KUBERNETES_PV_FETCH_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVS_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_PVS_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVS_FETCH_SUCCESS:
          this.data.pvTree = action.data;
          this.emit(EventTypes.KUBERNETES_PVS_FETCH_SUCCESS);
          break;

        case ActionTypes.REQUEST_KUBERNETES_PVC_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_PVC_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVC_CREATE_SUCCESS:
          this.data.pvcTree = action.data;
          this.emit(EventTypes.KUBERNETES_PVC_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVC_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_PVC_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVC_FETCH_SUCCESS:
          this.data.pvc = action.data;
          this.emit(EventTypes.KUBERNETES_PVC_FETCH_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVCS_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_PVCS_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PVCS_FETCH_SUCCESS:
          this.data.pvcTree = action.data;
          this.emit(EventTypes.KUBERNETES_PVCS_FETCH_SUCCESS);
          break;
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
    return !!this.listeners(KUBERNETES_CHANGE).length;
  }

  createPod() {
    console.log('Staring to create Pod');
    return KubernetesActions.createPod(...arguments);
  }

  createPV() {
    console.log('Staring to create PV');
    return KubernetesActions.createPV(...arguments);
  }

  createPVC() {
    console.log('Staring to create PVC');
    return KubernetesActions.createPVC(...arguments);
  }

  getPod() {
    console.log('Get a Pod');
    KubernetesActions.getPod(...arguments);
    return this.data.pod;
  }

  getPV() {
    console.log('Get a PV');
    KubernetesActions.getPV(...arguments);
    return this.data.pv;
  }

  getPVC() {
    console.log('Get a PVC');
    KubernetesActions.getPVC(...arguments);
    return this.data.pvc;
  }

  get pvTree() {
    return new PVTree(this.data.pvTree);
  }

  get pvcTree() {
    return new PVCTree(this.data.pvcTree);
  }

  get podTree() {
    return new PodTree(this.data.podTree);
  }

  get storeID() {
    return 'kubernetes';
  }
}

module.exports = new KubernetesStore();
