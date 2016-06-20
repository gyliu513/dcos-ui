import {Route, Redirect, NotFoundRoute} from 'react-router';

import dashboard from './dashboard';
import {Hooks} from 'PluginSDK';
import Index from '../pages/Index';
import nodes from './nodes';
import NotFoundPage from '../pages/NotFoundPage';
import System from './factories/system';
import Policies from './factories/policies';
import services from './services';
import images from './images';
import universe from './universe';
import storage from './storage';
import namespaces from './namespaces';

// Statically defined routes
let applicationRoutes = [
  dashboard,
  namespaces,
  services,
  nodes,
  images,
  universe,
  storage,
  {
    type: Redirect,
    from: '/',
    to: 'dashboard'
  },
  {
    type: NotFoundRoute,
    handler: NotFoundPage
  }
];

// Modules that produce routes
let routeFactories = [System, Policies];

function getApplicationRoutes() {
  let routes = applicationRoutes.slice();

  routeFactories.forEach(function (routeFactory) {
    // console.log(JSON.stringify(routeFactory.getRoutes()));
    routes.push(routeFactory.getRoutes());
  });

  return [
    {
      type: Route,
      name: 'home',
      path: '/',
      children: [
        {
          type: Route,
          id: 'index',
          handler: Index,
          children: routes
        }
      ]
    }
  ];
}

function getRoutes() {
  // Get application routes
  let routes = getApplicationRoutes();
  // console.log(routes);
  // Provide opportunity for plugins to inject routes
  return Hooks.applyFilter('applicationRoutes', routes);
}

module.exports = {
  getRoutes
};
