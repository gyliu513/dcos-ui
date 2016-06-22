import Item from './Item';

module.exports = class RC extends Item {
  getName() {
    return this.get('metadata').name;
  }

  getNamespace() {
    return this.get('metadata').namespace;
  }

  getStatus() {
    return this.get('status').phase;
  }

  getImage() {
    return '/kuber.png';
  }
};
