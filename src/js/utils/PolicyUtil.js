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
      let {metadata, spec} = formModel;

      if (formModel.metadata != null) {
        definition.name = metadata.name;
        definition.namespace = metadata.namespace;
      }

      if (formModel.spec != null) {
        if (spec.scaleRef != null) {
          definition.kind = spec.scaleTargetRef.kind;
          definition.name = spec.scaleTargetRef.name;
        }

        definition.minReplicas = spec.minReplicas;
        definition.maxReplicas = spec.maxReplicas;

        if (spec.cpuUtilization != null) {
          definition.targetCPUUtilizationPercentage =
              spec.cpuUtilization.targetPercentage;
        }
      }
    }
    return new Policy(definition);
  },

  createFormModelFromSchema: function (schema, policy = new Policy()) {

    return getFindPropertiesRecursive(policy, schema.properties);
  },

  getPolicyDefinitionFromPolicy: function (policy) {
    let policyDefinition = {};

    policyDefinition.metadata = policy.getMetadata();
    policyDefinition.spec = policy.getSpec();

    return policyDefinition;
  }
};

module.exports = PolicyUtil;
