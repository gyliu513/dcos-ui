import {RequestUtil} from 'mesosphere-shared-reactjs';

import EventDispatcher from '../EventDispatcher';

let SDK = require('../../SDK').getSDK();

let {Config} =
  SDK.get(['Config']);

const ProjectActions = {
  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/projects`,
      success: function (response) {
        EventDispatcher.handleServerAction({
          type: 'REQUEST_PROJECT_SUCCESS',
          data: response.array
        });
      },
      error: function (xhr) {
        EventDispatcher.handleServerAction({
          type: 'REQUEST_PROJECT_ERROR',
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  addProject: function (data) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/projects`,
      method: 'POST',
      data,
      success: function () {
        EventDispatcher.handleServerAction({
          type: 'REQUEST_PROJECT_CREATE_SUCCESS',
          data: data.name
        });
      },
      error: function (xhr) {
        EventDispatcher.handleServerAction({
          type: 'REQUEST_PROJECT_CREATE_ERROR',
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  deleteProject: function (projectID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/projects/${projectID}`,
      method: 'DELETE',
      success: function () {
        EventDispatcher.handleServerAction({
          type: 'REQUEST_PROJECT_DELETE_SUCCESS',
          projectID
        });
      },
      error: function (xhr) {
        EventDispatcher.handleServerAction({
          type: 'REQUEST_PROJECT_DELETE_ERROR',
          data: RequestUtil.getErrorFromXHR(xhr),
          projectID
        });
      }
    });
  }
};

module.exports = ProjectActions;