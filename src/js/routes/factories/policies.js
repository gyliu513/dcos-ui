import {Route, Redirect} from 'react-router';

import {Hooks} from 'PluginSDK';
import RepositoriesTab from '../../pages/system/RepositoriesTab';
import PoliciesPage from '../../pages/PoliciesPage';
import UnitsHealthTab from '../../pages/system/UnitsHealthTab';
import UsersTab from '../../pages/system/UsersTab';

let RouteFactory = {

  getPolicyRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      Hooks.applyFilter('policyRoutes', {
        routes: [
          {
            type: Route,
            name: 'policies-policy-page1',
            path: 'page1/?',
            handler: UnitsHealthTab
          },
          {
            type: Route,
            name: 'policies-policy-page2',
            path: 'page2/?',
            handler: RepositoriesTab
          }
        ],
        redirect: {
          type: Redirect,
          from: '/policies/policy/?',
          to: 'policies-policy-page1'
        }
      })
    );
  },

  getAlertRoutes() {
    // Return filtered Routes
    return this.getFilteredRoutes(
      Hooks.applyFilter('alertRoutes', {
        routes: [
          {
            type: Route,
            name: 'policies-alert-page1',
            path: 'page1/?',
            handler: UsersTab
          },
          {
            type: Route,
            name: 'policies-alert-page2',
            path: 'page2/?',
            handler: RepositoriesTab
          }
        ],
        redirect: {
          type: Redirect,
          from: '/policies/alert/?',
          to: 'policies-alert-page1'
        }
      })
    );
  },

  getPoliciesRoutes() {
    let policyRoute = {
      type: Route,
      name: 'policies-policy',
      path: 'policy/?',
      // Get children for Overview
      children: RouteFactory.getPolicyRoutes()
    };

    let alertRoute = {
      type: Route,
      name: 'policies-alert',
      path: 'alert/?',
      // Get children for Overview
      children: RouteFactory.getAlertRoutes()
    };

    // Return filtered Routes
    return this.getFilteredRoutes(
      // Pass in Object so Plugins can mutate routes and the default redirect
      Hooks.applyFilter('policiesRoutes', {
        routes: [policyRoute, alertRoute],
        redirect: {
          type: Redirect,
          from: '/policies/?',
          to: 'policies-policy'
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
