import {Route, Redirect} from 'react-router';

import PVsTab from '../pages/storage/PVsTab';
import StoragePage from '../pages/StoragePage';
import PVDetail from '../components/PVDetail';

let storageRoutes = {
  type: Route,
  name: 'storage-page',
  handler: StoragePage,
  path: '/storage/?',
  children: [
    {
      type: Route,
      name: 'storage-pvs',
      path: 'pvs/?',
      handler: PVsTab,
      children: [
        {
          type: Route,
          name: 'storage-pvs-detail',
          path: ':namespace/:name/?',
          handler: PVDetail
        }
      ]
    },
    {
      type: Redirect,
      from: '/storage/?',
      to: 'storage-pvs'
    }
  ]
};

module.exports = storageRoutes;
