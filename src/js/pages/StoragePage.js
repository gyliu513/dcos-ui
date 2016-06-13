import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import TabsMixin from '../mixins/TabsMixin';

var StoragePage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [TabsMixin],

  displayName: 'StoragePage',

  statics: {
    routeConfig: {
      label: 'Storage',
      icon: 'storage',
      matches: /^\/storage/
    }
  },

  getInitialState: function () {
    return {
      currentTab: 'storage-pvs'
    };
  },

  componentWillMount: function () {
    this.tabs_tabs = {
      'storage-pvs': 'PV',
      'storage-pvcs': 'PVC',
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
        title="Storage">
        <RouteHandler />
      </Page>
    );
  }

});

module.exports = StoragePage;
