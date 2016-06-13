import {Route} from 'react-router';

import StoragePage from '../pages/StoragePage';
import PVsTab from '../pages/storage/PVsTab';
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
    }
  ]
};

module.exports = storageRoutes;
