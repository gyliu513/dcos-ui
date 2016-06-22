import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import RouterUtil from '../utils/RouterUtil';
import TabsMixin from '../mixins/TabsMixin';

var ServicesPage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [TabsMixin],

  displayName: 'ServicesPage',

  statics: {
    routeConfig: {
      label: 'Workloads',
      icon: 'services',
      matches: /^\/services/
    }
  },

  getInitialState: function () {
    return {
      currentTab: 'services-pods'
    };
  },

  componentWillMount: function () {
    this.tabs_tabs = {
      'services-pods': 'Pod',
      'services-rcs': 'Replication Controller',
      'services-kservices': 'Service',
      'services-jobs': 'Job',
      'services-rss': 'Replication Set',
    };
    this.updateCurrentTab();
  },

  updateCurrentTab: function () {
    let routes = this.context.router.getCurrentRoutes();
    let currentTab = routes[routes.length - 1].name;
    if (currentTab != null) {
      this.setState({currentTab});
    }
  },

  getNavigation: function () {
    if (RouterUtil.shouldHideNavigation(this.context.router)) {
      return null;
    }

    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getRoutedTabs()}
      </ul>
    );
  },

  render: function () {
    // Make sure to grow when logs are displayed
    let routes = this.context.router.getCurrentRoutes();

    return (
      <Page
        navigation={this.getNavigation()}
        dontScroll={routes[routes.length - 1].dontScroll}
        title="Services">
        <RouteHandler />
      </Page>
    );
  }

});

module.exports = ServicesPage;
