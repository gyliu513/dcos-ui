import {RequestUtil} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import KubernetesUtil from '../utils/KubernetesUtil';

var AppDispatcher = require('./AppDispatcher');
var Config = require('../config/Config');

const KubernetesActions = {
  getPod: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (name, namespace) {
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/${namespace}/pods/${name}`,
          success: function (response) {
            try {
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_POD_FETCH_SUCCESS,
                data: response
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_POD_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_POD_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  getPV: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (name) {
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/persistenvolumes/${name}`,
          success: function (response) {
            try {
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_PV_FETCH_SUCCESS,
                data: response
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PV_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PV_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  getPVC: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (name, namespace) {
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`,
          success: function (response) {
            try {
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_PVC_FETCH_SUCCESS,
                data: response
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PVC_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PVC_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  getPolicy: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (name, namespace) {
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/apis/autoscaling/v1/namespaces/${namespace}/horizontalpodautoscalers/${name}`,
          success: function (response) {
            try {
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_POLICY_FETCH_SUCCESS,
                data: response
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_POLICY_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_POLICY_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  fetchPods: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function () {
        console.log('fetchPods');
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/pods`,
          success: function (response) {
            try {
              let data = KubernetesUtil.parsePods(response.items);
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_SUCCESS,
                data
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PODS_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  fetchPVs: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function () {
        console.log('fetchPVs');
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/persistentvolumes`,
          success: function (response) {
            try {
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_PVS_FETCH_SUCCESS,
                data: response
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PVS_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PVS_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  fetchPVCs: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function () {
        console.log('fetchPVCs');
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/default/persistentvolumeclaims`,
          success: function (response) {
            try {
              let data = KubernetesUtil.parsePods(response.items);
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_PVCS_FETCH_SUCCESS,
                data
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PVCS_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_PVCS_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  fetchPolicies: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (namespace) {
        console.log('fetchPolicies');
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/apis/autoscaling/v1/namespaces/${namespace}/horizontalpodautoscalers`,
          success: function (response) {
            try {
              let data = KubernetesUtil.parsePolicies(response.items);
              console.log(data)
              AppDispatcher.handleServerAction({
                type: ActionTypes.REQUEST_KUBERNETES_POLICIES_FETCH_SUCCESS,
                data
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_POLICIES_FETCH_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_KUBERNETES_POLICIES_FETCH_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  createPV: function (data) {
    console.log('Creating PV');
    RequestUtil.json({
      url: `${Config.rootUrl}/kubernetes/api/v1/persistentvolumes`,
      method: 'POST',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_PV_CREATE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_PV_CREATE_ERROR,
          data: RequestUtil.parseResponseBody(xhr),
          xhr
        });
      }
    });
  },

  removePV: function (name) {
    console.log('Removing PV');
    RequestUtil.json({
      url: `${Config.rootUrl}/kubernetes/api/v1/persistentvolumes/${name}`,
      method: 'DELETE',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_PV_DELETE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_PV_DELETE_ERROR,
          data: RequestUtil.parseResponseBody(xhr),
          xhr
        });
      }
    });
  },

  createPVC: function (data) {
    console.log('Creating PVC');
    console.log(JSON.stringify(data));
    RequestUtil.json({
      url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/default/persistentvolumeclaims`,
      method: 'POST',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_PVC_CREATE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_PVC_CREATE_ERROR,
          data: RequestUtil.parseResponseBody(xhr),
          xhr
        });
      }
    });
  },

  createPod: function (data) {
    console.log('Creating Pod');
    RequestUtil.json({
      url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/default/pods`,
      method: 'POST',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_POD_CREATE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_POD_CREATE_ERROR,
          data: RequestUtil.parseResponseBody(xhr),
          xhr
        });
      }
    });
  },

  createPolicy: function (data, namespace) {
    console.log('Creating Policy');
    RequestUtil.json({
      url: `${Config.rootUrl}/kubernetes/apis/autoscaling/v1/namespaces/${namespace}/horizontalpodautoscalers`,
      method: 'POST',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_POLICY_CREATE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_KUBERNETES_POLICY_CREATE_ERROR,
          data: RequestUtil.parseResponseBody(xhr),
          xhr
        });
      }
    });
  }
};

module.exports = KubernetesActions;
