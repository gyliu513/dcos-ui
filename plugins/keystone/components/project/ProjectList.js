let SDK = require('../../SDK').getSDK();

let {List, Item} =
  SDK.get(['List', 'Item']);

class ProjectList extends List {};

ProjectList.type = Item;

module.exports = ProjectList;