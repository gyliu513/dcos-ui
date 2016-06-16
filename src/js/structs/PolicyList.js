import List from './List';
import Policy from './Policy';
import StringUtil from '../utils/StringUtil';

class PolicyList extends List {
  filter(filters) {
    let policies = this.getItems();

    if (filters) {
      if (filters.name) {
        policies = StringUtil.filterByString(
          policies,
          function (policy) { return policy.metadata.name; },
          filters.name);
      }
    }

    return new PolicyList({items: policies});
  }
};

PolicyList.type = Policy;

module.exports = PolicyList;
