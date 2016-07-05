/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {Route} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Redirect from './components/login/Redirect';
import LoginPage from './components/login/LoginPage';
import ProjectTab from './components/project/ProjectTab';
import UserDropup from './components/login/UserDropup';
import ProjectStore from './components/project/ProjectStore';
import UserOrganizationTab from './components/users/UserOrganizationTab';

let SDK = require('./SDK').getSDK();

let {
  AccessDeniedPage,
  ApplicationUtil,
  Authenticated,
  AuthStore,
  ConfigStore,
  CookieUtils,
  RouterUtil
} = SDK.get([
  'AccessDeniedPage',
  'ApplicationUtil',
  'AuthStore',
  'Authenticated',
  'ConfigStore',
  'CookieUtils',
  'RouterUtil'
]);

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
    'applicationRouter',
    'userLoginSuccess',
    'userLogoutSuccess',
    'redirectToLogin'
  ],

  filters: [
    'delayApplicationLoad',
    'sidebarFooter',
    'applicationRoutes',
    'organizationRoutes',
    'serverErrorModalListeners',
    'sidebarNavigation',
    'usersTabContent',
    'userFormModalDefinition'
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

    SDK.addStoreConfig({
      storeID: 'project',
      store: ProjectStore,
      events: {
        success: 'PROJECT_SUCCESS',
        error: 'PROJECT_ERROR',
        createSuccess: 'PROJECT_CREATE_SUCCESS',
        createError: 'PROJECT_CREATE_ERROR',
        deleteSuccess: 'PROJECT_DELETE_SUCCESS',
        deleteError: 'PROJECT_DELETE_ERROR'
      },
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    });
  },

  redirectToLogin(transition) {
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

  applicationRouter(router) {
    this.applicationRouter = router;
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
            child_.to = 'redirected';
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
      },
      {
        handler: Redirect,
        name: 'redirected',
        path: 'redirected',
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

  userFormModalDefinition(form, props, stat) {
    var options = [];
    ProjectStore.projects.forEach(project => {
      options.push({
        html: project.name,
        id: project.projectid
      });
    });

    form.unshift(
      {
        fieldType: 'select',
        name: 'project',
        placeholder: 'Project',
        options: options,
        showLabel: false,
        validation: function (value) {
          return !!value;
        },
        validationErrorText: 'One option has to be selected',
        value: 'Project',
      },
      {
        fieldType: 'text',
        name: 'name',
        placeholder: 'Name',
        required: true,
        showError: stat.errorMsg,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'password',
        name: 'password',
        placeholder: 'Password',
        required: true,
        showError: stat.errorMsg,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      }
    );

    return form;
  },

  usersTabContent(page, table) {
    return (
    <UserOrganizationTab
      key="organization-tab"
      items={page.props.items}
      itemID="uid"
      itemName="user"
      handleNewItemClick={table.handleNewUserClick} />
    );
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

  userLoginSuccess() {
    let redirectTo = RouterUtil.getRedirectTo();

    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      ApplicationUtil.beginTemporaryPolling(() => {
        let loginRedirectRoute = AuthStore.get('loginRedirectRoute');

        if (loginRedirectRoute) {
          // Go to redirect route if it is present
          this.applicationRouter.transitionTo(loginRedirectRoute);
        } else if (AuthStore.getUser() && AuthStore.getUser().uid !== 'admin') {
          this.applicationRouter.transitionTo('/services');
        } else {
          // Go to home
          this.applicationRouter.transitionTo('/');
        }
      });
    }
  },

  userLogoutSuccess() {
    // Reload configuration because we need to get 'firstUser' which is
    // dynamically set based on number of users
    configResponseCallback = this.navigateToLoginPage;
    ConfigStore.fetchConfig();
  },

  delayApplicationLoad(value) {
    let user = AuthStore.getUser();

    // If user is logged in, then let's let the app do its thing
    if (user) {
      return value;
    }

    // Let's wait till login and then we'll request mesos summary before render
    return false;
  },

  navigateToLoginPage() {
    window.location.href = '#/login';
  }
});
