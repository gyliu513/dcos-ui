import AppDispatcher from '../events/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import DeploymentsList from '../structs/DeploymentsList';
import ServiceTree from '../structs/ServiceTree';
import {
	KUBERNETES_POD_CREATE_ERROR,
	KUBERNETES_POD_CREATE_SUCCESS
} from '../constants/EventTypes';
var KubernetesActions = require('../events/KubernetesActions');

class KubernetesStore extends BaseStore {
  constructor() {
    super(...arguments);

    this.getSet_data = {
      apps: {},
      deployments: new DeploymentsList(),
      groups: new ServiceTree()
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
          this.emit(KUBERNETES_POD_CREATE_SUCCESS);
          break;
      }

      return true;
    });

    this.dispatcherIndex = AppDispatcher.register((payload) => {
      if (payload.source !== ActionTypes.SERVER_ACTION) {
        return false;
      }

      return true;
    });
  }

  createPod() {
    return KubernetesActions.createPod(...arguments);
  }
}

module.exports = new KubernetesStore();
