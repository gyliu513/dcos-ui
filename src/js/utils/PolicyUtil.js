import Policy from '../structs/Policy';

const getFindPropertiesRecursive = function (policy, item) {

  return Object.keys(item).reduce(function (memo, subItem) {
    if (item[subItem].type === 'object') {
      memo[subItem] = getFindPropertiesRecursive(policy, item[subItem].properties);

      return memo;
    }

    memo[subItem] = item[subItem].default

    if (item[subItem].getter) {
      memo[subItem] = item[subItem].getter(policy);
    }

    return memo;
  }, {});
};

const PolicyUtil = {
  createPolicyFromFormModel: function (formModel) {
    let definition = {};

    if (formModel != null) {
      definition.metadata = {
        'name': formModel.general.name,
        'namespace': formModel.general.namespace
      };

      if (formModel.spec != null) {
        let scaleKind = '';

        if (formModel.spec.typeOfscaleTarget) {
          if (formModel.spec.typeOfscaleTarget.toLowerCase() === 'replicationcontroller') {
            scaleKind = 'ReplicationController';
          } else if (formModel.spec.typeOfscaleTarget.toLowerCase() === 'deployment') {
            scaleKind = 'Deployment';
          }
        } else {
          scaleKind = 'ReplicationController';
        }

        definition.spec = {
          'scaleTargetRef': {
            'kind': scaleKind,
            'name': formModel.spec.nameOfScaleTarget
          },
          'minReplicas': formModel.spec.minReplicas,
          'maxReplicas': formModel.spec.maxReplicas,
          'targetCPUUtilizationPercentage': formModel.spec.targetCPUUtilizationPercentage
        };
      }
    }

    return new Policy(definition);
  },

  createFormModelFromSchema: function (schema, policy = new Policy()) {
    return getFindPropertiesRecursive(policy, schema.properties);
  },

  getPolicyDefinitionFromPolicy: function (policy) {
    let policyDefinition = {};

    policyDefinition.apiVersion = 'extensions/v1beta1';
    policyDefinition.kind = 'HorizontalPodAutoscaler';
    policyDefinition.metadata = {
      'name': policy.metadata.name,
      'namespace': policy.metadata.namespace
    };
    policyDefinition.spec = {
      'scaleRef': {
        'kind': policy.spec.scaleTargetRef.kind,
        'name': policy.spec.scaleTargetRef.name,
        'subresource': 'scale'
      },
      'minReplicas': policy.spec.minReplicas,
      'maxReplicas': policy.spec.maxReplicas,
      'cpuUtilization': {
        'targetPercentage': policy.spec.targetCPUUtilizationPercentage
      }
    };

    return policyDefinition;
  }
};

module.exports = PolicyUtil;