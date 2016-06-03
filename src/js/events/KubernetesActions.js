import {RequestUtil} from 'mesosphere-shared-reactjs';

import {
  REQUEST_KUBERNETES_POD_CREATE_ERROR,
  REQUEST_KUBERNETES_POD_CREATE_SUCCESS,
} from '../constants/ActionTypes';
var AppDispatcher = require('./AppDispatcher');
var Config = require('../config/Config');

module.exports = {

  createPod: function (data) {
    console.log('Creating Pod');
    RequestUtil.json({
      url: `${Config.rootUrl}/marathon/v2/apps`,
      // url: '9.21.58.21:8888/api/v1/namespaces/default/pods',
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
