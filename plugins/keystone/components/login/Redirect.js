import React from 'react';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';

let SDK = require('../../SDK').getSDK();

let {AuthStore} =
  SDK.get(['AuthStore']);

class Redirect extends mixin(StoreMixin) {
  componentWillMount() {
    super.componentWillMount();

    if (AuthStore.getUser() && AuthStore.getUser().uid === 'admin') {
      this.context.router.transitionTo('/services');
    } else {
      this.context.router.transitionTo('/dashboard');
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }
}

Redirect.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Redirect;