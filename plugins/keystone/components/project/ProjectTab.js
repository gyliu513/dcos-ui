import React from 'react';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ProjectStore from './ProjectStore';
import ProjectList from './ProjectList';

import ProjectOrganizationTab from './ProjectOrganizationTab';
import RequestErrorMsg from '../../../../src/js/components/RequestErrorMsg';
import ProjectFormModal from './ProjectFormModal';

// let SDK = require('../SDK').getSDK();

// import {Form, Modal} from 'reactjs-components';

const PROJECT_CHANGE_EVENTS = [
  'onProjectStoreCreateSuccess',
  'onProjectStoreDeleteSuccess'
];

const METHODS_TO_BIND = [
  'handleNewProjectClick',
  'handleNewProjectClose',
  'onProjectStoreSuccess',
  'onProjectStoreError'
];

class ProjectPage extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'project',
        events: ['success', 'error', 'createSuccess', 'deleteSuccess'],
        suppressUpdate: true
      }
    ];

    this.state = {
      openNewProjectModal: false,
      projectStoreError: false,
      projectStoreSuccess: false,
      projects: []
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    PROJECT_CHANGE_EVENTS.forEach(
      (event) => {
        this[event] = this.onProjectChange;
      }
    );
  }

  onProjectStoreSuccess(data) {
    this.setState({
      projectStoreError: false,
      projectStoreSuccess: true,
      projects: new ProjectList({items: data})
    });
  }

  onProjectStoreError() {
    this.setState({
      projectStoreError: true,
      projectStoreSuccess: false
    });
  }

  onProjectChange() {
    ProjectStore.fetchProjects();
  }

  handleNewProjectClick() {
    this.setState({openNewProjectModal: true});
  }

  handleNewProjectClose() {
    this.setState({openNewProjectModal: false});
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  componentDidMount() {
    super.componentDidMount();
    ProjectStore.fetchProjects();
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getContents() {
    // We want to always render the portals (side panel and modal),
    // so only this part is showing loading and error screen.
    if (this.state.usersStoreError) {
      return (
        <RequestErrorMsg />
      );
    }

    if (!this.state.projectStoreSuccess) {
      return this.getLoadingScreen();
    }

    let items = this.state.projects.getItems();
    console.log(items);

    return (<ProjectOrganizationTab
        key="organization-tab"
        items={items}
        itemID="projectid"
        itemName="project"
        handleNewItemClick={this.handleNewProjectClick} />);
  }

  render() {
    return (
      <div>
        {this.getContents()}
      <ProjectFormModal
        open={this.state.openNewProjectModal}
        onClose={this.handleNewProjectClose}/>
      </div>
    );
  }
}

ProjectPage.contextTypes = {
  router: React.PropTypes.func
};

module.exports = ProjectPage;