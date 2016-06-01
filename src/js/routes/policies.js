import {Route} from 'react-router';

import PoliciesPage from '../pages/PoliciesPage';
import PoliciesTab from '../pages/policies/PoliciesTab';

let policiesRoutes = {
  type: Route,
  name: 'policies-page',
  handler: PoliciesPage,
  path: '/policies/?',
  children: [
    {
      type: Route,
      handler: PoliciesTab,
      children: [
        {
          type: Route,
          name: 'policies-detail',
          path: ':id/?'
        }
      ]
    }
  ]
};

module.exports = policiesRoutes;
