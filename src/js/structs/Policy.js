import Item from './Item';

module.exports = class Policy extends Item {
  getName() {
    return this.get('metadata.name');
  }

  getNamespace() {
    return this.get('metadata.namespace');
  }

  getCreationTimestamp() {
    return this.get('metadata.creationTimestamp');
  }

  getMetadata() {
    return {
      metadata: {
        name: this.get('metadata.name'),
        namespace: this.get('metadata.namespace'),
        creationTimestamp: this.get('metadata.creationTimestamp')
      }
    }
  }

  getSpec() {
    return {
      spec: {
        scaleTargetRef: {
          kind: this.get('spec.scaleTargetRef.kind'),
          name: this.get('spec.scaleTargetRef.name'),
          subresource: 'scale'
        },
        minReplicas: this.get('spec.minReplicas'),
        maxReplicas: this.get('spec.maxReplicas'),
        cpuUtilization: {
          targetPercentage: this.get('spec.cpuUtilization.targetCPUUtilizationPercentage')
        }
      }
    };
  }

  getStatus() {
    return {
      status: {
        currentReplicas: this.get('status.currentReplicas'),
        desiredReplicas: this.get('status.desiredReplicas'),
        currentCPUUtilizationPercentage: this.get('status.currentCPUUtilizationPercentage'),
        lastScaleTime: this.get('status.lastScaleTime')
      }
    };
  }
};
