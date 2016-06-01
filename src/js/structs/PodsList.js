import List from './List';
import Pod from './Pod';

class PodsList extends List {
  filterItemsByFilter(filters) {
    let pods = this.getItems();

    if (filters) {
      if (filters.id) {
        let filterProperties = Object.assign({}, this.getFilterProperties(), {
          name: function (item) {
            return item.getName();
          }
        });

        pods = this.filterItemsByText(filters.id, filterProperties).getItems();
      }
    }

    return new PodsList({items: pods});
  }

  findItemByNameAndNamespace(name, namespace) {
    return this.findItem(function (item) {
      return (item.getName() === name && item.getNamespace() === namespace);
    });
  }
}

PodsList.type = Pod;

module.exports = PodsList;
