import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import TabsMixin from '../mixins/TabsMixin';

var NamespacesPage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [TabsMixin],

  displayName: 'NamespacesPage',

  statics: {
    routeConfig: {
      label: 'Namespaces',
      icon: 'namespaces',
      matches: /^\/namespaces/
    }
  },

  getInitialState: function () {
    return {
      currentTab: 'namespaces-namespaces'
    };
  },

  componentWillMount: function () {
    this.tabs_tabs = {
      'namespaces-namespaces': 'Namespace',
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
        title="Namespaces">
        <RouteHandler />
      </Page>
    );
  }

});

module.exports = NamespacesPage;
