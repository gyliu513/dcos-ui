import mixin from 'reactjs-mixin';
import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import SidebarActions from '../events/SidebarActions';
import TabsMixin from '../mixins/TabsMixin';

class ImagesPage extends mixin(TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = {'images-page': 'Images'};
    this.state = {currentTab: 'images-page'};
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
        title="Images">
        <RouteHandler />
      </Page>
    );
  }
}

ImagesPage.contextTypes = {
  router: React.PropTypes.func
};

ImagesPage.routeConfig = {
  label: 'Images',
  icon: 'images',
  matches: /^\/images/
};

ImagesPage.willTransitionTo = function () {
  SidebarActions.close();
};

module.exports = ImagesPage;
