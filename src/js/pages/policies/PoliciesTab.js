import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from '../../components/AlertPanel';
import DCOSStore from '../../stores/DCOSStore';

class PoliciesTab extends mixin(StoreMixin) {

  constructor() {
    super(...arguments);

    this.store_listeners = [
      {name: 'dcos', events: ['change']}
    ];
  }

  getContents() {
    // Render loading screen
    if (!DCOSStore.dataProcessed) {
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

    if (this.props.params.taskID) {
      return (
        <RouteHandler />
      );
    }

    // Render empty panel
    return (
      <AlertPanel
        title="No Policies Found"
        iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-policies flush-top">
        <p className="flush-bottom">
         Policies aren't available yet.
        </p>
      </AlertPanel>
    );
  }

  render() {
    let {id} = this.props.params;
    return this.getContents(decodeURIComponent(id));
  }
}

PoliciesTab.contextTypes = {
  router: React.PropTypes.func
};

module.exports = PoliciesTab;
