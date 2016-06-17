import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
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
    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getRoutedTabs()}
      </ul>
    );
  },

  render: function () {
    return (
      <Page
        navigation={this.getNavigation()}
        title="Services">
        <RouteHandler />
      </Page>
    );
  }

});

module.exports = ServicesPage;
