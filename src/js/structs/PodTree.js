import Application from './Application';
import Framework from './Framework';
// import HealthSorting from '../constants/HealthSorting';
// import HealthStatus from '../constants/HealthStatus';
import Service from './Service';
import ServiceStatus from '../constants/ServiceStatus';
import Tree from './Tree';

module.exports = class PodTree extends Tree {
  /**
   * (Marathon) PodTree
   * @param {{
   *          id:string,
   *          items:array<({id:string, items:array}|*)>,
   *          apps:array,
   *          filterProperties:{propertyName:(null|string|function)}
   *        }} options
   * @constructor
   * @struct
   */
  constructor(options = {}) {
    super(options);

    this.id = '/';
    if (options.id || typeof options.id == 'string') {
      this.id = options.id;
    }

    // Converts items into instances of PodTree, Application or Framework
    // based on their properties.
    this.list = this.list.map((item) => {
      if (item instanceof PodTree) {
        return item;
      }

      // Check item properties and convert items with an items array or an apps
      // and groups array (Marathon group structure) into PodTree instances.
      if (item.items != null && Array.isArray(item.items)) {
        return new this.constructor(
          Object.assign({filterProperties: this.getFilterProperties()}, item)
        );
      }

      // Check the DCOS_PACKAGE_FRAMEWORK_NAME label to determine if the item
      // should be converted to an Application or Framework instance.
      if (item.labels && item.labels.DCOS_PACKAGE_FRAMEWORK_NAME) {
        return new Framework(item);
      } else {
        return new Application(item);
      }
    });
  }

  getId() {
    return this.id;
  }

  /**
   * @param {string} id
   * @return {Service|PodTree} matching item
   */
  findItemById(id) {
    return this.findItem(function (item) {
      return item.getId() === id;
    });
  }

  filterItemsByFilter(filter) {
    let pods = this.getItems();

    if (filter.id) {
    }

    return new this.constructor(Object.assign({}, this, {items: pods}));
  }

  getInstancesCount() {
    return this.reduceItems(function (instances, item) {
      if (item instanceof Service) {
        instances += item.getInstancesCount();
      }

      return instances;
    }, 0);
  }

  getName() {
    return this.getId().split('/').pop();
  }

  getResources() {
    return this.reduceItems(function (resources, item) {
      if (item instanceof Service) {
        let {cpus = 0, mem = 0, disk = 0} = item.getResources();

        resources.cpus += cpus;
        resources.mem += mem;
        resources.disk += disk;
      }

      return resources;
    }, {cpus: 0, mem: 0, disk: 0});
  }

  getStatus() {
    let instances = this.getInstancesCount();
    if (instances === 0) {
      return ServiceStatus.SUSPENDED.displayName;
    }
  }
};
