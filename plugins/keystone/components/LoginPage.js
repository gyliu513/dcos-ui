import React from 'react';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';
import {Modal} from 'reactjs-components';

let SDK = require('../SDK').getSDK();

let {AuthStore, MetadataStore} =
  SDK.get(['AuthStore', 'MetadataStore']);

let METHODS_TO_BIND = [
  'handleModalClose',
  'onMessageReceived'
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

    window.addEventListener('message', this.onMessageReceived);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    window.removeEventListener('message', this.onMessageReceived);
  }

  onMessageReceived(event) {
    if (event.origin !== SDK.config.authHost) {
      return;
    }

    let data = JSON.parse(event.data);

    switch (data.type) {
      case 'token':
        AuthStore.login({token: data.token});
        break;
      case 'error':
        this.navigateToAccessDenied();
        break;
    }
  }

  handleLogin() {
    var user = this.refs.user.value;
    var password = this.refs.password.value;
    AuthStore.login({user: user, password: password});
    return;
  }

  onAuthStoreSuccess() {
    let router = this.context.router;
    let loginRedirectRoute = AuthStore.get('loginRedirectRoute');

    if (loginRedirectRoute) {
      router.transitionTo(loginRedirectRoute);
    } else {
      router.transitionTo('/');
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
            <form className="flush-bottom" onSubmit={this.handleLogin.bind(this)}>
              <div className="form-group">
                <input type="text"
                 autoFocus={true}
                 className="form-control flush-bottom"
                 placeholder="Username"
                 ref="user"/>
                <input type="password"
                 autoFocus={true}
                 className="form-control flush-bottom"
                 placeholder="Password"
                 ref="password"/>
              </div>
              <div className="button-collection button-collection-align-horizontal-center flush-bottom">
                <button className="button button-primary button-large button-wide-below-screen-mini"
                    onClick={this.handleLogin.bind(this)}>
                  Login
                </button>
              </div>
            </form>
        </Modal>
        <Modal
          maxHeightPercentage={0.9}
          onClose={this.handleModalClose}
          open={this.state.showClusterError}
          showCloseButton={true}
          showHeader={false}
          showFooter={false}>
          <p className="text-align-center">
            Unable to login to your DC/OS cluster. Clusters must be connected to the internet.
          </p>
          <p className="flush-bottom text-align-center">
            Please contact your system administrator or see the <a href={MetadataStore.buildDocsURI('/administration/installing/')} target="_blank">documentation.</a>
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

