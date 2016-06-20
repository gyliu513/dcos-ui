import {Route, Redirect} from 'react-router';

import NamespacesTab from '../pages/namespaces/NamespacesTab';

import NamespacesPage from '../pages/NamespacesPage';

import PodDetail from '../components/PodDetail';

let namespaceRoutes = {
  type: Route,
  name: 'namespaces-page',
  handler: NamespacesPage,
  path: '/namespaces/?',
  children: [
    {
      type: Route,
      name: 'namespaces-namespaces',
      path: 'namespaces/?',
      handler: NamespacesTab,
      children: [
        {
          type: Route,
          name: 'namespaces-namespaces-detail',
          path: ':namespace/:name/?',
          handler: PodDetail
        }
      ]
    },
    {
      type: Redirect,
      from: '/namespaces/?',
      to: 'namespaces-namespaces'
    }
  ]
};

module.exports = namespaceRoutes;
