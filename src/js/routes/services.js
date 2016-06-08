import {Route} from 'react-router';

import DeploymentsTab from '../pages/services/DeploymentsTab';
import PodsTab from '../pages/services/PodsTab';
import RCsTab from '../pages/services/RCsTab';
import KservicesTab from '../pages/services/KservicesTab';
import ServiceOverlay from '../components/ServiceOverlay';
import ServicesPage from '../pages/ServicesPage';
import ServicesTab from '../pages/services/ServicesTab';
import TaskDetail from '../components/TaskDetail';
import PodDetail from '../components/PodDetail';

let serviceRoutes = {
  type: Route,
  name: 'services-page',
  handler: ServicesPage,
  path: '/services/?',
  children: [
    {
      type: Route,
      name: 'services-deployments',
      path: 'deployments/',
      handler: DeploymentsTab
    },
    {
      type: Route,
      name: 'services-pods',
      path: 'pods/?',
      handler: PodsTab,
      children: [
        {
          type: Route,
          name: 'services-pods-detail',
          path: ':namespace/:name/?',
          handler: PodDetail
        }
      ]
    },
    {
      type: Route,
      handler: ServicesTab,
      children: [
        {
          type: Route,
          name: 'services-detail',
          path: ':id/?',
          children: [
            {
              type: Route,
              name: 'services-task-details',
              path: 'task-detail/:taskID/?',
              handler: TaskDetail
            }
          ]
        },
        {
          type: Route,
          name: 'service-ui',
          path: 'ui/:serviceName/?',
          handler: ServiceOverlay
        },
        {
          type: Route,
          name: 'services-panel',
          path: 'service-detail/:serviceName/?'
        }
      ]
    },
    {
      type: Route,
      name: 'services-rcs',
      path: 'rcs/',
      handler: RCsTab
    },
    {
      type: Route,
      name: 'services-kservices',
      path: 'kservices/',
      handler: KservicesTab
    }
  ]
};

module.exports = serviceRoutes;
