import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import SidebarActions from '../events/SidebarActions';
import TabsMixin from '../mixins/TabsMixin';

class NetworksPage extends mixin(TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = {'networks-page': 'Networks'};
    this.state = {currentTab: 'networks-page'};
  }

  componentWillMount() {
    this.updateCurrentTab();
  }

  componentWillReceiveProps() {
    super.componentWillReceiveProps(...arguments);
    this.updateCurrentTab();
  }

  updateCurrentTab() {
    let routes = this.context.router.getCurrentRoutes();
    let currentTab = routes[routes.length - 1].name;
    if (currentTab != null) {
      this.setState({currentTab});
    }
  }

  getNavigation() {
    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getRoutedTabs()}
      </ul>
    );
  }

  render() {
    return (
      <Page
        navigation={this.getNavigation()}
        title="Networks">
        <RouteHandler />
      </Page>
    );
  }
}

NetworksPage.contextTypes = {
  router: React.PropTypes.func
};

NetworksPage.routeConfig = {
  label: 'Networks',
  icon: 'networks',
  matches: /^\/networks/
};

NetworksPage.willTransitionTo = function () {
  SidebarActions.close();
};

module.exports = NetworksPage;
