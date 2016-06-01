import List from './List';
import LogPolicy from './LogPolicy';
import StringUtil from '../utils/StringUtil';

class LogPolicyList extends List {
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

    return new LogPolicyList({items: policies});
  }
};

LogPolicyList.type = LogPolicy;

module.exports = LogPolicyList;
