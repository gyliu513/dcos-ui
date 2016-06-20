import {Link, RouteHandler} from 'react-router';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {Hooks} from 'PluginSDK';
import Page from '../components/Page';
import NotificationStore from '../stores/NotificationStore';
import SidebarActions from '../events/SidebarActions';
import TabsUtil from '../utils/TabsUtil';
import TabsMixin from '../mixins/TabsMixin';

// Default Tabs
let DEFAULT_POLICIES_TABS = {
  'policies-app': {
    content: 'Application Policy',
    priority: 50
  },
  'policies-log': {
    content: 'Log Policy',
    priority: 30
  }
};

let DEFAULT_APPLICATION_POLICY_TABS = {
  'policies-app-policy': {
    content: 'Policy',
    priority: 30
  },
  'policies-app-scale': {
    content: 'Scale Info',
    priority: 20
  }
};

let DEFAULT_LOG_POLICY_TABS = {
  'policies-log-policy': {
    content: 'Policy',
    priority: 20
  },
  'policies-log-alert': {
    content: 'Alert',
    priority: 10
  }
};

let POLICIES_TABS;

class PoliciesPage extends mixin(TabsMixin) {
  constructor() {
    super();

    POLICIES_TABS = TabsUtil.sortTabs(
      Hooks.applyFilter('policies-tabs', DEFAULT_POLICIES_TABS)
    );

    Hooks.addFilter('policies-app-tabs', function (tabs) {
      return Object.assign(tabs, DEFAULT_APPLICATION_POLICY_TABS);
    });

    Hooks.addFilter('policies-log-tabs', function (tabs) {
      return Object.assign(tabs, DEFAULT_LOG_POLICY_TABS);
    });

    this.tabs_tabs = {};
    this.state = {};
  }

  componentWillMount() {
    this.updateCurrentTab();
  }

  componentWillReceiveProps() {
    this.updateCurrentTab();
  }

  updateCurrentTab() {
    let routes = this.context.router.getCurrentRoutes();
    let currentTab = routes[routes.length - 1].name;
    // Get top level Tab
    let topLevelTab = currentTab.split('-').slice(0, 2).join('-');

    this.tabs_tabs = TabsUtil.sortTabs(
      Hooks.applyFilter(`${topLevelTab}-tabs`, {})
    );

    this.setState({currentTab});
  }

  getRoutedItem(tab) {
    let notificationCount = NotificationStore.getNotificationCount(tab);

    if (notificationCount > 0) {
      return (
        <Link
          to={tab}
          className="tab-item-label inverse flush">
          <span className="tab-item-label-text">
            {POLICIES_TABS[tab]}
          </span>
          <span className="badge-container badge-primary">
            <span className="badge text-align-center">{notificationCount}</span>
          </span>
        </Link>
      );
    }

    return (
      <Link
        to={tab}
        className="tab-item-label inverse flush">
        <span className="tab-item-label-text">
          {POLICIES_TABS[tab]}
        </span>
      </Link>
    );
  }

  getNavigation() {
    let routes = this.context.router.getCurrentRoutes();
    let currentRoute = routes[routes.length - 2].name;

    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {TabsUtil.getTabs(
          POLICIES_TABS,
          currentRoute,
          this.getRoutedItem
        )}
      </ul>
    );
  }

  getSubNavigation() {
    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getRoutedTabs()}
      </ul>
    );
  }

  render() {
    return (
      <Page
        title="Policies"
        navigation={this.getNavigation()}>
        <div className="container-pod container-pod-short flush-top">
          <div className="container-pod container-pod-divider-bottom container-pod-divider-inverse container-pod-divider-bottom-align-right flush-top flush-bottom">
            {this.getSubNavigation()}
          </div>
        </div>
        <RouteHandler currentTab={this.state.currentTab} />
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