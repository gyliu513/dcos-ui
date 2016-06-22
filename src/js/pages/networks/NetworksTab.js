import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from '../../components/AlertPanel';
import DCOSStore from '../../stores/DCOSStore';
// import ServiceTree from '../../structs/ImageTree';

class NetworksTab extends mixin(StoreMixin) {

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

    // Render images table
    // if (item instanceof ServiceTree && item.getItems().length > 0) {
    //   return this.getServiceTreeView(item);
    // }

    // Render images detail
    // if (item instanceof Service) {
    //   return (<ServiceDetail service={item} />);
    // }

    // Render empty panel
    return (
      <AlertPanel
        title="No Networks Found"
        iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-images flush-top">
        <p className="flush-bottom">
         Networks aren't available yet.
        </p>
      </AlertPanel>
    );
  }

  render() {
    let {id} = this.props.params;
    return this.getContents(decodeURIComponent(id));
  }
}

NetworksTab.contextTypes = {
  router: React.PropTypes.func
};

module.exports = NetworksTab;
