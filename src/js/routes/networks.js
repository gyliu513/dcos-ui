import Router from 'react-router';
let Route = Router.Route;

import NetworksTab from '../pages/networks/NetworksTab';
import NetworksPage from '../pages/NetworksPage';

let networksRoutes = {
  type: Route,
  name: 'networks-page',
  handler: NetworksPage,
  path: '/networks/?',
  children: [
    {
      type: Route,
      handler: NetworksTab,
      children: [
        {
          type: Route,
          name: 'networks-detail',
          path: ':id/?'
        }
      ]
    }
  ]
};

module.exports = networksRoutes;