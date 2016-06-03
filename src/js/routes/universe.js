import {Route, Redirect} from 'react-router';

import InstalledPackagesTab from '../pages/universe/InstalledPackagesTab';
import PackageDetailTab from '../pages/universe/PackageDetailTab';
import PackagesTab from '../pages/universe/PackagesTab';
import UniversePage from '../pages/UniversePage';
import KubernetesTab from '../pages/universe/KubernetesTab';
import KubernetesDetailTab from '../pages/universe/KubernetesDetailTab';

let universeRoutes = {
  type: Route,
  name: 'universe',
  path: 'universe/?',
  handler: UniversePage,
  children: [
    {
      type: Route,
      name: 'universe-packages',
      path: 'packages/?',
      handler: PackagesTab
    },
    {
      type: Route,
      name: 'universe-packages-detail',
      path: 'packages/:packageName?:packageVersion?',
      handler: PackageDetailTab
    },
    {
      type: Route,
      name: 'kubernetes-packages',
      path: 'kubernetes/?',
      handler: KubernetesTab
    },
    {
      type: Route,
      name: 'kubernetes-packages-detail',
      path: 'kubernetes/:packageName?:packageVersion?',
      handler: KubernetesDetailTab
    },
    {
      type: Route,
      name: 'universe-installed-packages',
      path: 'installed-packages/?',
      handler: InstalledPackagesTab
    },
    {
      type: Redirect,
      from: '/universe/?',
      to: 'universe-packages'
    }
  ]
};

module.exports = universeRoutes;
