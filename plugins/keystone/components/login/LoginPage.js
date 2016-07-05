import React from 'react';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
import {Form, Modal} from 'reactjs-components';

let SDK = require('../../SDK').getSDK();

let {AuthStore} =
  SDK.get(['AuthStore']);

let METHODS_TO_BIND = [
  'handleModalClose',
];

class LoginPage extends mixin(StoreMixin) {
  componentWillMount() {
    super.componentWillMount();

    if (AuthStore.getUser()) {
      this.context.router.transitionTo('/');
    }

    this.store_listeners = [
      {
        name: 'auth',
        events: ['success', 'error'],
        suppressUpdate: true
      }
    ];

    this.state = {
      showClusterError: false
    };

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  handleLogin(model) {
    AuthStore.login({uid: model.uid, password: model.password});
    return;
  }

  onAuthStoreSuccess() {
    let router = this.context.router;
    let loginRedirectRoute = AuthStore.get('loginRedirectRoute');

    if (loginRedirectRoute) {
      router.transitionTo(loginRedirectRoute);
    } else {
      if (AuthStore.getUser() && AuthStore.getUser().uid !== 'admin') {
        router.transitionTo('/services');
      } else {
        router.transitionTo('/');
      }
    }
  }

  onAuthStoreError(message, xhr) {
    if (xhr.status >= 400 && xhr.status < 500) {
      this.navigateToAccessDenied();
    } else {
      this.setState({showClusterError: true});
    }
  }

  handleModalClose() {
    this.setState({showClusterError: false});
  }

  navigateToAccessDenied() {
    let router = this.context.router;

    router.transitionTo('/access-denied');
  }

  getDefinition() {
    return [
      {
        fieldType: 'text',
        focused: true,
        name: 'uid',
        required: true,
        placeholder: 'User ID',
        writeType: 'input'
      },
      {
        fieldType: 'password',
        focused: true,
        name: 'password',
        placeholder: 'Password',
        required: true,
        writeType: 'input'
      },
      {
        fieldType: 'submit',
        buttonText: 'Login',
        buttonClass: 'button button-primary button-wide'
      }
    ];
  }

  render() {
    return (
      <div>
        <Modal
          closeByBackdropClick={false}
          maxHeightPercentage={0.9}
          modalClass="modal"
          modalClassName="login-modal"
          open={!this.state.showClusterError}
          showCloseButton={false}
          showHeader={true}
          showFooter={true}
          subHeader="Log in to your account">
            <Form
             className="form flush-bottom"
             definition={this.getDefinition()}
             onSubmit={this.handleLogin} />
        </Modal>
        <Modal
          maxHeightPercentage={0.9}
          onClose={this.handleModalClose}
          open={this.state.showClusterError}
          showCloseButton={true}
          showHeader={false}
          showFooter={false}>
          <p className="text-align-center">
            Unable to login to your Bluedock cluster.
          </p>
          <p className="flush-bottom text-align-center">
            Please contact your system administrator
          </p>
        </Modal>
      </div>
    );
  }
}

LoginPage.contextTypes = {
  router: React.PropTypes.func
};

module.exports = LoginPage;

