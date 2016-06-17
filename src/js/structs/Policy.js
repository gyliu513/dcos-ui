import Item from './Item';

module.exports = class Policy extends Item {
  getName() {
    return this.get('metadata.name');
  }

  getNamespace() {
    return this.get('metadata.namespace');
  }

  getTypeOfScaleTarget() {
    return this.get('spec.scaleTargetRef.kind');
  }

  getNameOfScaleTarget() {
    return this.get('spec.scaleTargetRef.name');
  }

  getMinReplicas() {
    return this.get('spec.minReplicas');
  }

  getMaxReplicas() {
    return this.get('spec.maxReplicas');
  }

  getTargetCPUUtilization() {
    return this.get('spec.targetCPUUtilizationPercentage');
  }

  getStatus() {
    return {
      currentReplicas: this.get('status.currentReplicas'),
      desiredReplicas: this.get('status.desiredReplicas'),
      currentCPUUtilizationPercentage: this.get('status.currentCPUUtilizationPercentage'),
      lastScaleTime: this.get('status.lastScaleTime')
    };
  }
};
