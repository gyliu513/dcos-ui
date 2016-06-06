import mixin from 'reactjs-mixin';
import {Hooks} from 'PluginSDK';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import UsersStore from '../../stores/UsersStore';
import OrganizationTab from '../system/OrganizationTab';
import RequestErrorMsg from '../../components/RequestErrorMsg';
import PolicyFormModal from '../../components/modals/PolicyFormModal';

const POLICY_CHANGE_EVENTS = [
  'onUserStoreCreateSuccess',
  'onUserStoreDeleteSuccess'
];

const METHODS_TO_BIND = [
  'handleNewUserClick',
  'handleNewUserClose',
  'onUsersStoreSuccess',
  'onUsersStoreError'
];

class PolicyTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = Hooks.applyFilter('usersTabStoreListeners', [
      {name: 'marathon', events: ['appsSuccess']},
      {
        name: 'user',
        events: ['createSuccess', 'deleteSuccess'],
        suppressUpdate: true
      },
      {name: 'users', events: ['success', 'error'], suppressUpdate: true}
    ]);

    this.state = {
      openNewPolicyModal: false,
      policyStoreError: false,
      policyStoreSuccess: false
    };

    Hooks.applyFilter('usersTabChangeEvents', POLICY_CHANGE_EVENTS).forEach(
      (event) => {
        this[event] = this.onUsersChange;
      }
    );

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    UsersStore.fetchUsers();
  }

  onUsersChange() {
    UsersStore.fetchUsers();
  }

  onUsersStoreSuccess() {
    this.setState({
      policyStoreError: false,
      policyStoreSuccess: true
    });
  }

  onUsersStoreError() {
    this.setState({
      policyStoreError: true,
      policyStoreSuccess: false
    });
  }

  handleNewUserClick() {
    this.setState({openNewPolicyModal: true});
  }

  handleNewUserClose() {
    this.setState({openNewPolicyModal: false});
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
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
    if (this.state.policyStoreError) {
      return (
        <RequestErrorMsg />
      );
    }

    if (!this.state.policyStoreSuccess) {
      return this.getLoadingScreen();
    }

    let items = UsersStore.getUsers().getItems();

    return Hooks.applyFilter('usersTabContent',
      <OrganizationTab
        key="organization-tab"
        items={items}
        itemID="uid"
        itemName="user"
        handleNewItemClick={this.handleNewUserClick} />,
        this
    );
  }

  render() {
    return (
      <div>
        {this.getContents()}
        <PolicyFormModal
          open={this.state.openNewPolicyModal}
          onClose={this.handleNewUserClose}/>
      </div>
    );
  }
}

PolicyTab.propTypes = {
  params: React.PropTypes.object
};

module.exports = PolicyTab;
