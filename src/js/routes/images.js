import {Route} from 'react-router';

import ImagesPage from '../pages/ImagesPage';
import ImagesTab from '../pages/images/ImagesTab';

let imagesRoutes = {
  type: Route,
  name: 'images-page',
  handler: ImagesPage,
  path: '/images/?',
  children: [
    {
      type: Route,
      handler: ImagesTab,
      children: [
        {
          type: Route,
          name: 'images-detail',
          path: ':id/?'
        }
      ]
    }
  ]
};

module.exports = imagesRoutes;
