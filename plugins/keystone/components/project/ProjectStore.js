import EventEmitter from 'events';

import EventDispatcher from '../EventDispatcher';

import ProjectActions from './ProjectActions';

/**
 * This store will keep track of users and their details
 */
class ProjectStore extends EventEmitter {
  constructor() {
    super(...arguments);

    this.data = {
      projects: []
    };

    this.dispatcherIndex = EventDispatcher.register((payload) => {
      if (payload.source !== 'EventAction') {
        return false;
      }

      var action = payload.action;
      switch (action.type) {
        // Get user
        case 'REQUEST_PROJECT_SUCCESS':
          this.data.projects = action.data;
          this.emit('PROJECT_SUCCESS', action.data);
          break;
        case 'REQUEST_PROJECT_ERROR':
          this.emit('PROJECT_ERROR', action.data);
        // Create user
        case 'REQUEST_PROJECT_CREATE_SUCCESS':
          this.emit('PROJECT_CREATE_SUCCESS', action);
          break;
        case 'REQUEST_PROJECT_CREATE_ERROR':
          this.emit('PROJECT_CREATE_ERROR', action.data, action.xhr);
          break;
        // Delete user
        case 'REQUEST_PROJECT_DELETE_SUCCESS':
          this.emit('PROJECT_DELETE_SUCCESS', action);
          break;
        case 'REQUEST_PROJECT_DELETE_ERROR':
          this.emit('PROJECT_DELETE_ERROR', action.data);
          break;
      }
    });
  }

  fetchProjects() {
    return ProjectActions.fetch(...arguments);
  }

  addProject() {
    return ProjectActions.addProject(...arguments);
  }

  deleteProject() {
    return ProjectActions.deleteProject(...arguments);
  }

  addChangeListener(eventName, callback) {
    this.on(eventName, callback);
  }

  removeChangeListener(eventName, callback) {
    this.removeListener(eventName, callback);
  }

  get projects() {
    return this.data.projects;
  }

  get storeID() {
    return 'user';
  }

}

module.exports = new ProjectStore();
