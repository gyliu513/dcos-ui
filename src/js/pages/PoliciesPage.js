import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import SidebarActions from '../events/SidebarActions';
import TabsMixin from '../mixins/TabsMixin';

class PoliciesPage extends mixin(TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = {'policies-page': 'Policies'};
    this.state = {currentTab: 'policies-page'};
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
        title="Policies">
        <RouteHandler />
      </Page>
    );
  }
}

PoliciesPage.contextTypes = {
  router: React.PropTypes.func
};

PoliciesPage.routeConfig = {
  label: 'Policies',
  icon: 'policies',
  matches: /^\/policies/
};

PoliciesPage.willTransitionTo = function () {
  SidebarActions.close();
};

module.exports = PoliciesPage;
