import Item from './Item';

module.exports = class Policy extends Item {
  getName() {
    return this.get('metadata.name');
  }

  getNamespace() {
    return this.get('metadata.namespace');
  }

  getMetadata() {
    return {
      name: this.get('metadata.name'),
      namespace: this.get('metadata.namespace')
    }
  }

  getSpec() {
    return {
      scaleTargetRef: {
        kind: this.get('spec.scaleTargetRef.kind'),
        name: this.get('spec.scaleTargetRef.name')
      },
      minReplicas: 1,
      maxReplicas: 2,
      cpuUtilization: {
        targetPercentage: this.get('spec.targetCPUUtilizationPercentage')
      }
    };
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
