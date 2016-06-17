import Item from './Item';

module.exports = class LogPolicy extends Item {
  getId() {
    return this.get('metadata.id');
  }

  getAppName() {
    return this.get('metadata.appName');
  }

  getKeywords() {
    return this.get('metadata.keywords');
  }

  getCycle() {
    return this.get('metadata.cycle');
  }

  getCount() {
    return this.get('metadata.count');
  }

  getContacter() {
    return this.get('metadata.contacter');
  }

  getEnable() {
    return this.get('metadata.enable');
  }

  getUpdateTime() {
    return this.get('metadata.updateTime');
  }

};
