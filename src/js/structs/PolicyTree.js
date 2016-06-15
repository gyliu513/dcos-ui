import Tree from './Tree';

module.exports = class PolicyTree extends Tree {
  /**
   * (Kubernetes) PolicyTree
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

    // Converts items into instances of PolicyTree, Application or Framework
    // based on their properties.
    this.list = this.list.map((item) => {
      if (item instanceof PolicyTree) {
        return item;
      }

      // Check item properties and convert items with an items array or an apps
      // and groups array (Marathon group structure) into PolicyTree instances.
      if (item.items != null && Array.isArray(item.items)) {
        return new this.constructor(
          Object.assign({filterProperties: this.getFilterProperties()}, item)
        );
      }
    });
  }

  getId() {
    return this.id;
  }

  findItemById(id) {
    return this.findItem(function (item) {
      return item.getId() === id;
    });
  }

  filterItemsByFilter(filter) {
    let policies = this.getItems();

    if (filter.id) {
    }

    return new this.constructor(Object.assign({}, this, {items: policies}));
  }

  getInstancesCount() {
    return this.reduceItems(function (instances, item) {
      if (item instanceof PolicyTree) {
        instances += item.getInstancesCount();
      }

      return instances;
    }, 0);
  }

  getName() {
    return this.getId().split('/').pop();
  }
};
