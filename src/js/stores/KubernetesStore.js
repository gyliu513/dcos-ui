import {EventEmitter} from 'events';

import AppDispatcher from '../events/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import Config from '../config/Config';
import PodsList from '../structs/PodsList';
import KServicesList from '../structs/KServicesList';
import RCsList from '../structs/RCsList';
import PVTree from '../structs/PVTree';
import PVCTree from '../structs/PVCTree';
import PolicyList from '../structs/PolicyList';
import LogPolicyList from '../structs/LogPolicyList';
import {
  KUBERNETES_CHANGE,
} from '../constants/EventTypes';
var KubernetesActions = require('../events/KubernetesActions');

let requestInterval;

function fetchKubernetes() {
  KubernetesActions.fetchKServices();
  KubernetesActions.fetchReplicationControllers();
  KubernetesActions.fetchPods();
  KubernetesActions.fetchPVs();
  KubernetesActions.fetchPVCs();
  KubernetesActions.fetchPolicies('default');
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
      kservice: {},
      rc: {},
      pv: {},
      pvc: {},
      policy: {},
      podList: {},
      kserviceList: {id: '/', items: []},
      rcList: {},
      pvTree: {id: '/', items: []},
      pvcTree: {id: '/', items: []},
      policyList: [],
      logPolicyList: []
    };

    this.dispatcherIndex = AppDispatcher.register((payload) => {
      if (payload.source !== ActionTypes.SERVER_ACTION) {
        return false;
      }

      var action = payload.action;
      switch (action.type) {
        // kservice
        case ActionTypes.REQUEST_KUBERNETES_SERVICE_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_SERVICE_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_SERVICE_CREATE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_SERVICE_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_SERVICE_DELETE_ERROR:
          this.emit(EventTypes.KUBERNETES_SERVICE_DELETE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_SERVICE_DELETE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_SERVICE_DELETE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_SERVICES_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_SERVICES_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_SERVICES_FETCH_SUCCESS:
          this.data.kserviceList = action.data;
          this.emit(EventTypes.KUBERNETES_SERVICES_FETCH_SUCCESS);
          break;
        // replication controller
        case ActionTypes.REQUEST_KUBERNETES_RC_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_RC_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_RC_CREATE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_RC_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_RC_DELETE_ERROR:
          this.emit(EventTypes.KUBERNETES_RC_DELETE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_RC_DELETE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_RC_DELETE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_RCS_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_RCS_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_RCS_FETCH_SUCCESS:
          this.data.rcList = action.data;
          this.emit(EventTypes.KUBERNETES_RCS_FETCH_SUCCESS);
          break;
        // Pod events
        case ActionTypes.REQUEST_KUBERNETES_POD_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_POD_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_CREATE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_POD_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_DELETE_ERROR:
          this.emit(EventTypes.KUBERNETES_POD_DELETE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POD_DELETE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_POD_DELETE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_PODS_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_SUCCESS:
          this.data.podList = action.data;
          this.emit(EventTypes.KUBERNETES_CHANGE);
          break;
        // PV events
        case ActionTypes.REQUEST_KUBERNETES_PV_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_PV_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PV_CREATE_SUCCESS:
          this.data.pvTree = action.data;
          this.emit(EventTypes.KUBERNETES_PV_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PV_DELETE_ERROR:
          this.emit(EventTypes.KUBERNETES_PV_DELETE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_PV_DELETE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_PV_DELETE_SUCCESS);
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
        // PVC events
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
        // Policy events
        case ActionTypes.REQUEST_KUBERNETES_POLICY_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_POLICY_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICY_CREATE_SUCCESS:
          this.data.policyList = action.data;
          this.emit(EventTypes.KUBERNETES_POLICY_CREATE_SUCCESS);
          console.log('Store create policy success.');
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICY_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_POLICY_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICY_FETCH_SUCCESS:
          this.data.policy = action.data;
          this.emit(EventTypes.KUBERNETES_POLICY_FETCH_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICIES_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_POLICIES_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICIES_FETCH_SUCCESS:
          this.data.policyList= action.data;
          this.emit(EventTypes.KUBERNETES_POLICIES_FETCH_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICY_DELETE_ERROR:
          this.emit(EventTypes.KUBERNETES_POLICY_DELETE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_POLICY_DELETE_SUCCESS:
          this.emit(EventTypes.KUBERNETES_POLICY_DELETE_SUCCESS);
          break;
        // Log Policy events
        case ActionTypes.REQUEST_KUBERNETES_LOG_POLICY_CREATE_ERROR:
          this.emit(EventTypes.KUBERNETES_LOG_POLICY_CREATE_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_LOG_POLICY_CREATE_SUCCESS:
          this.data.logPolicyList = action.data;
          this.emit(EventTypes.KUBERNETES_LOG_POLICY_CREATE_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_LOG_POLICY_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_LOG_POLICY_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_LOG_POLICY_FETCH_SUCCESS:
          this.data.logPolicy = action.data;
          this.emit(EventTypes.KUBERNETES_LOG_POLICY_FETCH_SUCCESS);
          break;
        case ActionTypes.REQUEST_KUBERNETES_LOG_POLICIES_FETCH_ERROR:
          this.emit(EventTypes.KUBERNETES_LOG_POLICIES_FETCH_ERROR, action.data);
          break;
        case ActionTypes.REQUEST_KUBERNETES_LOG_POLICIES_FETCH_SUCCESS:
          this.data.logPolicyList= action.data;
          this.emit(EventTypes.KUBERNETES_LOG_POLICIES_FETCH_SUCCESS);
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

  createReplicationController() {
    return KubernetesActions.createReplicationController(...arguments);
  }

  createKService() {
    return KubernetesActions.createKService(...arguments);
  }

  createPod() {
    return KubernetesActions.createPod(...arguments);
  }

  createPV() {
    return KubernetesActions.createPV(...arguments);
  }

  fetchReplicationControllers() {
    return KubernetesActions.fetchReplicationControllers(...arguments);
  }

  fetchKServices() {
    return KubernetesActions.fetchKServices(...arguments);
  }

  fetchPods() {
    return KubernetesActions.fetchPods(...arguments);
  }

  deleteReplicationController() {
    return KubernetesActions.deleteReplicationController(...arguments);
  }

  deleteKService() {
    return KubernetesActions.deleteKService(...arguments);
  }

  deletePod() {
    return KubernetesActions.deletePod(...arguments);
  }

  removePV() {
    return KubernetesActions.removePV(...arguments);
  }

  createPVC() {
    console.log('Staring to create PVC');
    return KubernetesActions.createPVC(...arguments);
  }

  createPolicy() {
    console.log('Starting to create Policy');
    return KubernetesActions.createPolicy(...arguments);
  }

  createLogPolicy() {
    console.log('Staring to create Log Policy')
    return KubernetesActions.createLogPolicy(...arguments);
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

  getPolicy() {
    console.log('Get a policy');
    KubernetesActions.getPolicy(...arguments);
    return this.data.policy;
  }

  getLogPolicy() {
    console.log('Get a log policy');
    KubernetesActions.getLogPolicy(...arguments);
    return this.data.logPolicy;
  }

  get pvTree() {
    return new PVTree(this.data.pvTree);
  }

  get pvcTree() {
    return new PVCTree(this.data.pvcTree);
  }

  get podList() {
    return new PodsList(this.data.podList);
  }

  get kserviceList() {
    return new KServicesList(this.data.kserviceList);
  }

  get rcList() {
    return new RCsList(this.data.rcList);
  }

  get policyList() {
    return new PolicyList({items: this.data.policyList});
  }

  get logPolicyList() {
    return new LogPolicyList({items: this.data.logPolicyList});
  }

  deletePolicy() {
    console.log('Deleting to create Policy');
    KubernetesActions.deletePolicy(...arguments);
  }

  deleteLogPolicy() {
    console.log('Deleting to create Log Policy');
  }

  get storeID() {
    return 'kubernetes';
  }
}

module.exports = new KubernetesStore();