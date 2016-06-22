import {RequestUtil} from 'mesosphere-shared-reactjs';

import EventDispatcher from './EventDispatcher';

let SDK = require('../SDK').getSDK();

let {Util, Config} =
  SDK.get(['Util', 'Config']);

const ProjectActions = {
  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/users`,
      success: function (response) {
        EventDispatcher.handleServerAction({
          type: REQUEST_PROJECT_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        EventDispatcher.handleServerAction({
          type: REQUEST_PROJECT_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  addProject: function (data) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}`,
      method: 'POST',
      data,
      success: function () {
        EventDispatcher.handleServerAction({
          type: REQUEST_PROJECT_CREATE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        EventDispatcher.handleServerAction({
          type: REQUEST_PROJECT_CREATE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  deleteProject: function (projectID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${projectID}`,
      method: 'DELETE',
      success: function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_PROJECT_DELETE_SUCCESS,
          projectID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_PROJECT_DELETE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          projectID
        });
      }
    });
  }
};

if (Config.useFixtures) {
  let usersFixture = require('../../../tests/_fixtures/acl/users-unicode.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ProjectActions = {
    fetch: {event: 'success', success: {response: usersFixture}},
    addUser: {event: 'success'},
    deleteUser: {event: 'success'}
  };

  Object.keys(global.actionTypes.ProjectActions).forEach(function (method) {
    ProjectActions[method] = RequestUtil.stubRequest(
      ProjectActions, 'ProjectActions', method
    );
  });
}

module.exports = ProjectActions;