/**
 * Parse an item into a Job or JobTree - This method will create sub trees if
 * needed to insert the item at the correct location
 * (based on id/path matching).
 * @param {{
 *          id:string,
 *          items:array<({id:string, items:array}|*)>,
 * }} parent tree to add item to
 * @param {{id:string}} item pod to add to parent
 * @param {[type]} podsAlreadyAdded hash of id and pods of pods that
 * have already been added to the parent
 */
function addPod(parent, item, podsAlreadyAdded) {
  // selfLink of a pod is a unique and never changed identifier
  const itemId = item.metadata.selfLink;

  // Check if the item (group or pod) has already been added
  if (podsAlreadyAdded[itemId]) {
    // handle merge data for pod, not for group
    item = Object.assign(podsAlreadyAdded[itemId], item);

    return;
  }

  // Initialize items, if they don't already exist, before push
  if (!parent.items) {
    parent.items = [];
  }

  // Store child as added
  podsAlreadyAdded[item.id] = item;
  parent.items.push(item);

  return;
}

function addPolicy(parent, item, policiesAlreadyAdded) {
  // selfLink of a pod is a unique and never changed identifier
  const itemId = item.metadata.selfLink;

  if (policiesAlreadyAdded[itemId]) {
    item = Object.assign(policiesAlreadyAdded[itemId], item);

    return;
  }

  // Initialize items, if they don't already exist, before push
  if (!parent.items) {
    parent.items = [];
  }

  // Store child as added
  policiesAlreadyAdded[item.id] = item;
  parent.items.push(item);

  return;
}

module.exports = {

  /**
   * [parseJobs description]
   * @param  {array} pods to be turned into an acceptable structure
   * for Job or JobTree
   * @return {{
   *          id:string,
   *          items:array<({id:string, items:array}|*)>,
   * }} pods and groups in a tree structure
   */
  parsePods(pods) {
    let rootTree = {id: '/'};
    let podsAlreadyAdded = {
      [rootTree.id]: rootTree
    };

    if (!Array.isArray(pods)) {
      pods = [pods];
    }

    pods.forEach(function (pod) {
      addPod(rootTree, pod, podsAlreadyAdded);
    });

    return rootTree;
  },

  parsePolicies(policies) {
    let rootTree = {id: '/'};
    let policiesAlreadyAdded = {
      [rootTree.id]: rootTree
    };

    if (!Array.isArray(policies)) {
      policies = [policies];
    }

    policies.forEach(function (policy) {
      addPolicy(rootTree, policy, policiesAlreadyAdded);
    });

    return rootTree;
  }
};
