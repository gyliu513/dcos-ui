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
        definition.spec = {
          'scaleTargetRef': {
            'kind': formModel.spec.typeOfscaleTarget,
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

    policyDefinition.kind = 'HorizontalPodAutoscaler';
    policyDefinition.metadata = policy.getMetadata();
    policyDefinition.spec = policy.getSpec();

    return policyDefinition;
  }
};

module.exports = PolicyUtil;
