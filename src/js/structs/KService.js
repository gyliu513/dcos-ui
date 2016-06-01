import Item from './Item';

// copied rom Pod.js, need to adjust to KService type
module.exports = class KService extends Item {
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

  getUID() {
    return this.get('metadata').uid;
  }

  getHostIP() {
    return this.get('status').hostIP;
  }

  getPodIP() {
    return this.get('status').podIP;
  }

  getAge() {
    // TODO: format time stamp to string
    return this.get('status').startTime;
  }

  getContainerImages() {
    // TODO: concat all container image here
    return this.get('status').containerStatuses[0].image;
  }

  getRestartCount() {
    return this.get('status').containerStatuses[0].restartCount;
  }
};
