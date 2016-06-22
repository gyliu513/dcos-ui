import React from 'react';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
// import {Form, Modal} from 'reactjs-components';

// let SDK = require('../SDK').getSDK();

const METHODS_TO_BIND = [
  'handleNewProjectClick',
  'handleNewProjectClose',
  'onProjectStoreSuccess',
  'onProjectStoreError'
];

class ProjectPage extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      openNewProjectModal: false,
      projectStoreError: false,
      projectStoreSuccess: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onProjectStoreSuccess() {
    this.setState({
      projectStoreError: false,
      projectStoreSuccess: true
    });
  }

  onProjectStoreError() {
    this.setState({
      projectStoreError: true,
      projectStoreSuccess: false
    });
  }

  handleNewProjectClick() {
    this.setState({openNewProejectModal: true});
  }

  handleNewProjectClose() {
    this.setState({openNewProjectModal: false});
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  componentDidMount() {
    super.componentDidMount();
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
    if (this.state.projectStoreError) {
      return '';
    }

    if (!this.state.projectStoreSuccess) {
      return this.getLoadingScreen();
    }

    return '';
  }

  render() {
    return (
      <div>
        {this.getContents()}
      </div>
    );
  }
}

ProjectPage.contextTypes = {
  router: React.PropTypes.func
};

module.exports = ProjectPage;