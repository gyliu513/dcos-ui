import {Route} from 'react-router';

import StoragePage from '../pages/StoragePage';
import StorageTab from '../pages/storage/StorageTab';

let storageRoutes = {
  type: Route,
  name: 'storage-page',
  handler: StoragePage,
  path: '/storage/?',
  children: [
    {
      type: Route,
      handler: StorageTab,
      children: [
        {
          type: Route,
          name: 'storage-detail',
          path: ':id/?'
        }
      ]
    }
  ]
};

module.exports = storageRoutes;
