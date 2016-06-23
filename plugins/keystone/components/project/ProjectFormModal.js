import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ProjectStore from './ProjectStore';

let SDK = require('../../SDK').getSDK();

let {FormModal} =
  SDK.get(['FormModal']);

const METHODS_TO_BIND = [
  'handleNewProjectSubmit',
  'onProjectStoreCreateSuccess'
];

class ProjectFormModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableNewProject: false,
      errorMsg: false,
      errorCode: null
    };

    this.store_listeners = [
      {
        name: 'project',
        events: ['createSuccess', 'createError'],
        suppressUpdate: true
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onProjectStoreCreateSuccess() {
    this.setState({
      disableNewProject: false,
      errorMsg: false,
      errorCode: null
    });
    this.props.onClose();
  }

  onUserStoreCreateError(errorMsg, userID, xhr) {
    this.setState({
      disableNewProject: false,
      errorMsg,
      errorCode: xhr.status
    });
  }

  handleNewProjectSubmit(model) {
    this.setState({disableNewUser: true});

    let projectModelObject = Object.assign({}, model);
    ProjectStore.addProject(projectModelObject);
  }

  getButtonDefinition() {
    return [
      {
        text: 'Cancel',
        className: 'button button-medium',
        isClose: true
      },
      {
        text: 'Add Project',
        className: 'button button-success button-medium',
        isSubmit: true
      }
    ];
  }

  getNewProjectFormDefinition() {
    let {state} = this;

    return [{
      fieldType: 'text',
      name: 'name',
      placeholder: 'Project Name',
      required: true,
      showError: state.errorMsg,
      showLabel: false,
      writeType: 'input',
      validation: function () { return true; },
      value: ''
    }];
  }

  getHeader() {
    return (
      <h2 className="modal-header-title text-align-center flush-top">
        Add Project to Cluster
      </h2>
    );
  }

  render() {
    return (
      <FormModal
        buttonDefinition={this.getButtonDefinition()}
        definition={this.getNewProjectFormDefinition()}
        disabled={this.state.disableNewProject}
        onClose={this.props.onClose}
        onSubmit={this.handleNewProjectSubmit}
        open={this.props.open}>
        {this.getHeader()}
      </FormModal>
    );
  }
}
module.exports = ProjectFormModal;
