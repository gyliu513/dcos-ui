/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {Route} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import LoginPage from './components/LoginPage';
import ProjectTab from './components/ProjectTab';
import UserDropup from './components/UserDropup';

let SDK = require('./SDK').getSDK();

let {AuthStore, AccessDeniedPage, Authenticated, ConfigStore, CookieUtils} = SDK.get([
  'AuthStore', 'AccessDeniedPage', 'Authenticated', 'ConfigStore', 'CookieUtils']);

let configResponseCallback = null;

let nonAdminMenuItems = [
  'services-page',
  'policies',
  'universe',
  'storage-page'
];

let ORGANIZATION_TABS = {
  'system-organization-users': {
    content: 'Users',
    priority: 50
  },
  'system-organization-projects': {
    content: 'Projects',
    priority: 50
  }
};

module.exports = Object.assign({}, StoreMixin, {
  actions: [
    'AJAXRequestError',
    'userLogoutSuccess',
    'redirectToLogin'
  ],

  filters: [
    'sidebarFooter',
    'applicationRoutes',
    'organizationRoutes',
    'serverErrorModalListeners',
    'sidebarNavigation'
  ],

  initialize() {
    this.filters.forEach(filter => {
      SDK.Hooks.addFilter(filter, this[filter].bind(this));
    });
    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });
    this.store_initializeListeners([{
      name: 'config',
      events: ['success', 'error']
    }]);
    // add a filter with highest priority
    SDK.Hooks.addFilter('system-organization-tabs', function (tabs) {
      return Object.assign(tabs, ORGANIZATION_TABS);
    }, 1);
  },

  redirectToLogin(transition) {
    console.log('redirect to login')
    transition.redirect('/login');
  },

  sidebarNavigation(MenuItems) {
    if (AuthStore.getUser().uid === 'admin') {
      return MenuItems;
    }
    return nonAdminMenuItems;
  },

  AJAXRequestError(xhr) {
    if (xhr.status !== 401 && xhr.status !== 403) {
      return;
    }

    let location = global.location.hash;
    let onAccessDeniedPage = /access-denied/.test(location);
    let onLoginPage = /login/.test(location);

    // Unauthorized
    if (xhr.status === 401 && !onLoginPage && !onAccessDeniedPage) {
      global.document.cookie = CookieUtils.emptyCookieWithExpiry(new Date(1970));
      global.location.href = '#/login';
    }

    // Forbidden
    if (xhr.status === 403 && !onLoginPage && !onAccessDeniedPage) {
      global.location.href = '#/access-denied';
    }
  },

  sidebarFooter(value, defaultButtonSet) {
    let buttonSet = defaultButtonSet;
    if (value && value.props.children) {
      buttonSet = value.props.children;
    }

    return (
      <UserDropup items={buttonSet} />
    );
  },

  serverErrorModalListeners(listeners) {
    listeners.push({
      name: 'auth',
      events: ['logoutError']
    });

    return listeners;
  },

  applicationRoutes(routes) {
    // Override handler of index to be 'authenticated'
    routes[0].children.forEach(function (child) {
      if (child.id === 'index') {
        child.handler = new Authenticated(child.handler);
        child.children.forEach(function (child_) {
          // Change the base route if it is not admin
          if (child_.from === '/'
              && AuthStore.getUser()
              && AuthStore.getUser().uid !== 'admin') {
            child_.to = 'services-page';
          }
        });
      }
    });

    // Add access denied and login pages
    routes[0].children.unshift(
      {
        type: Route,
        name: 'access-denied',
        path: 'access-denied',
        handler: AccessDeniedPage
      },
      {
        handler: LoginPage,
        name: 'login',
        path: 'login',
        type: Route
      }
    );
    return routes;
  },

  organizationRoutes(routes) {
    routes.routes.unshift(
      {
        type: Route,
        name: 'system-organization-projects',
        path: 'projects/?',
        handler: ProjectTab,
        children: []
      }
    );
    return routes;
  },

  onConfigStoreSuccess() {
    if (configResponseCallback) {
      configResponseCallback();
      configResponseCallback = null;
    }
  },

  onConfigStoreError() {
    if (configResponseCallback) {
      configResponseCallback();
      configResponseCallback = null;
    }
  },

  userLogoutSuccess() {
    // Reload configuration because we need to get 'firstUser' which is
    // dynamically set based on number of users
    configResponseCallback = this.navigateToLoginPage;
    ConfigStore.fetchConfig();
  },

  navigateToLoginPage() {
    window.location.href = '#/login';
  }
});
