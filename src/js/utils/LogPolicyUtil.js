import LogPolicy from '../structs/LogPolicy';

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

const LogPolicyUtil = {
  createLogPolicyFromFormModel: function (formModel) {
    let definition = {};

    if (formModel != null) {
      definition.metadata = {
        'appName': formModel.general.appName,
        'keywords': formModel.general.keywords,
        'cycle': formModel.general.keywords,
        'count': formModel.general.count,
        'contacter': formModel.general.contacter
      };
    }

    return new LogPolicy(definition);
  },

  createFormModelFromSchema: function (schema, policy = new LogPolicy()) {
    return getFindPropertiesRecursive(policy, schema.properties);
  },

  getLogPolicyDefinitionFromLogPolicy: function (policy) {
    let policyDefinition = {};

    policyDefinition.kind = 'LogPolicyDefinition';
    policyDefinition.metadata = policy.getMetadata();

    return policyDefinition;
  }
};

module.exports = LogPolicyUtil;
