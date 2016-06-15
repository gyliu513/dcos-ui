/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import ActionsModal from './ActionsModal';
import KubernetesStore from '../../stores/KubernetesStore';

class PolicyActionsModal extends ActionsModal {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'policy',
        events: ['deleteError', 'deleteSuccess'],
        suppressUpdate: true
      }
    ];

  }

  onPolicyStoreDeleteError(requestError) {
    this.onActionError(requestError);
  }

  onPolicyStoreDeleteSuccess() {
    this.onActionSuccess();
  }

  handleButtonConfirm() {
    let {itemID, selectedItems} = this.props;
    let itemsByID = selectedItems.map(function (item) {
      return item[itemID];
    });

    itemsByID.forEach(function (policy) {
      KubernetesStore.deletePolicy(policy);
    });

    this.setState({pendingRequest: true, requestErrors: []});
  }
}

PolicyActionsModal.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.object.isRequired,
  itemID: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  selectedItems: React.PropTypes.array.isRequired
};

module.exports = PolicyActionsModal;
