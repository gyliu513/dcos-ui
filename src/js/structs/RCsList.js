import List from './List';
import RC from './RC';

class RCsList extends List {
  filterItemsByFilter(filters) {
    let rcs = this.getItems();

    if (filters) {
      if (filters.id) {
        let filterProperties = Object.assign({}, this.getFilterProperties(), {
          name: function (item) {
            return item.getName();
          }
        });

        rcs = this.filterItemsByText(filters.id, filterProperties).getItems();
      }
    }

    return new RCsList({items: rcs});
  }

  findItemByNameAndNamespace(name, namespace) {
    return this.findItem(function (item) {
      return (item.getName() === name && item.getNamespace() === namespace);
    });
  }
}

RCsList.type = RC;

module.exports = RCsList;
