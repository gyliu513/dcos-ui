import Item from './Item';
import PodStatus from '../constants/PodStatus';

module.exports = class Pod extends Item {
  getArguments() {
    return this.get('args');
  }

  getName() {
    return this.get('metadata').name;
  }

  getNamespace() {
    return this.get('metadata').namespace;
  }

  getStatus() {
    let {tasksRunning} = this.getTasksSummary();
    let deployments = this.getDeployments();

    if (deployments.length > 0) {
      return PodStatus.DEPLOYING.displayName;
    }

    if (tasksRunning > 0) {
      return PodStatus.RUNNING.displayName;
    }

    let instances = this.getInstancesCount();
    if (instances === 0) {
      return PodStatus.SUSPENDED.displayName;
    }
  }
};
