/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import ProjectStore from './ProjectStore';

let SDK = require('../../SDK').getSDK();

let {ActionsModal} =
  SDK.get(['ActionsModal']);

class ProjectActionsModal extends ActionsModal {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'project',
        events: ['deleteError', 'deleteSuccess'],
        suppressUpdate: true
      }
    ];
  }

  onUserStoreDeleteError(requestError) {
    this.onActionError(requestError);
  }

  onProjectStoreDeleteSuccess() {
    this.onActionSuccess();
  }

  handleButtonConfirm() {
    let {itemID, selectedItems} = this.props;
    let itemsByID = selectedItems.map(function (item) {
      return item[itemID];
    });

    itemsByID.forEach(function (projectID) {
      ProjectStore.deleteProject(projectID);
    });

    this.setState({pendingRequest: true, requestErrors: []});
  }
}

ProjectActionsModal.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.object.isRequired,
  itemID: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  selectedItems: React.PropTypes.array.isRequired
};

module.exports = ProjectActionsModal;
