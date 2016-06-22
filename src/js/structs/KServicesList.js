import List from './List';
import KService from './KService';

class KServicesList extends List {
  filterItemsByFilter(filters) {
    let kservices = this.getItems();

    if (filters) {
      if (filters.id) {
        let filterProperties = Object.assign({}, this.getFilterProperties(), {
          name: function (item) {
            return item.getName();
          }
        });

        kservices = this.filterItemsByText(filters.id, filterProperties).getItems();
      }
    }

    return new KServicesList({items: kservices});
  }

  findItemByNameAndNamespace(name, namespace) {
    return this.findItem(function (item) {
      return (item.getName() === name && item.getNamespace() === namespace);
    });
  }
}

KServicesList.type = KService;

module.exports = KServicesList;
