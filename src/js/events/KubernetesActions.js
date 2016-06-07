import {RequestUtil} from 'mesosphere-shared-reactjs';

import {
  REQUEST_KUBERNETES_POD_CREATE_ERROR,
  REQUEST_KUBERNETES_POD_CREATE_SUCCESS,
  REQUEST_KUBERNETES_POD_CREATE_ONGOING
} from '../constants/ActionTypes';
import KubernetesUtil from '../utils/KubernetesUtil';

var AppDispatcher = require('./AppDispatcher');
var Config = require('../config/Config');

const KubernetesActions = {
  fetchPods: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function () {
        RequestUtil.json({
          url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/default/pods`,
          success: function (response) {
            try {
              let data = KubernetesUtil.parsePods(response.items);
              AppDispatcher.handleServerAction({
                type: REQUEST_KUBERNETES_POD_CREATE_SUCCESS,
                data
              });
              resolve();
            } catch (error) {
              this.error(error);
            }
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: REQUEST_KUBERNETES_POD_CREATE_SUCCESS,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: REQUEST_KUBERNETES_POD_CREATE_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  ),

  createPod: function (data) {
    console.log('Creating Pod');
    console.log(JSON.stringify(data));
    RequestUtil.json({
      url: `${Config.rootUrl}/kubernetes/api/v1/namespaces/default/pods`,
      method: 'POST',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_KUBERNETES_POD_CREATE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_KUBERNETES_POD_CREATE_ERROR,
          data: RequestUtil.parseResponseBody(xhr),
          xhr
        });
      }
    });
  }
};

module.exports = KubernetesActions;
