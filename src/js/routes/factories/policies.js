import {Route, Redirect} from 'react-router';

import {Hooks} from 'PluginSDK';
import PoliciesPage from '../../pages/PoliciesPage';
import ApplicationPolicyTab from '../../pages/policies/application/PolicyTab';
import ApplicationScaleTab from '../../pages/policies/application/ScaleTab';
import LogPolicyTab from '../../pages/policies/log/PolicyTab';
import LogAlertTab from '../../pages/policies/log/AlertTab';

let RouteFactory = {

  getApplicationPolicyRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      Hooks.applyFilter('appPolicyRoutes', {
        routes: [
          {
            type: Route,
            name: 'policies-app-policy',
            path: 'policy/?',
            handler: ApplicationPolicyTab
          },
          {
            type: Route,
            name: 'policies-app-scale',
            path: 'scale/?',
            handler: ApplicationScaleTab
          }
        ],
        redirect: {
          type: Redirect,
          from: '/policies/application/?',
          to: 'policies-app-policy'
        }
      })
    );
  },

  getLogPolicyRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      Hooks.applyFilter('logPolicyRoutes', {
        routes: [
          {
            type: Route,
            name: 'policies-log-policy',
            path: 'policy/?',
            handler: LogPolicyTab
          },
          {
            type: Route,
            name: 'policies-log-alert',
            path: 'alert/?',
            handler: LogAlertTab
          }
        ],
        redirect: {
          type: Redirect,
          from: '/policies/log/?',
          to: 'policies-log-policy'
        }
      })
    );
  },

  getPoliciesRoutes() {
    let appPolicyRoute = {
      type: Route,
      name: 'policies-app',
      path: 'application/?',
      // Get children for Overview
      children: RouteFactory.getApplicationPolicyRoutes()
    };

    let logPolicyRoute = {
      type: Route,
      name: 'policies-log',
      path: 'log/?',
      // Get children for Overview
      children: RouteFactory.getLogPolicyRoutes()
    };

    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      Hooks.applyFilter('policiesRoutes', {
        routes: [appPolicyRoute, logPolicyRoute],
        redirect: {
          type: Redirect,
          from: '/policies/?',
          to: 'policies-app'
        }
      })
    );
  },

  getFilteredRoutes(filteredRoutes) {
    // Push redirect onto Routes Array
    return filteredRoutes.routes.concat([filteredRoutes.redirect]);
  },

  getRoutes() {

    let childRoutes = this.getPoliciesRoutes();

    return {
      type: Route,
      name: 'policies',
      path: 'policies/?',
      handler: PoliciesPage,
      children: childRoutes
    };
  }
};

module.exports = RouteFactory;
