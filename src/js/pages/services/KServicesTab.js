import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from '../../components/AlertPanel';
import DCOSStore from '../../stores/DCOSStore';
import FilterBar from '../../components/FilterBar';
import FilterHeadline from '../../components/FilterHeadline';
import QueryParamsMixin from '../../mixins/QueryParamsMixin';
import SaveStateMixin from '../../mixins/SaveStateMixin';
import {
  POD_FORM_MODAL
} from '../../constants/ModalKeys';
import KService from '../../structs/KService';
import KServiceDetail from '../../components/KServiceDetail';
import PodFilterTypes from '../../constants/PodFilterTypes';
import KServiceFormModal from '../../components/modals/KServiceFormModal';
import PodSearchFilter from '../../components/PodSearchFilter';
import KServicesBreadcrumb from '../../components/KServicesBreadcrumb';
import KServicesTable from '../../components/KServicesTable';
import KServicesList from '../../structs/KServicesList';
import SidebarActions from '../../events/SidebarActions';
import SidePanels from '../../components/SidePanels';

var DEFAULT_FILTER_OPTIONS = {
  searchString: ''
};

let saveState_properties = Object.keys(DEFAULT_FILTER_OPTIONS);

var KServicesTab = React.createClass({

  displayName: 'KServicesTab',

  saveState_key: 'kservicesPage',

  saveState_properties,

  mixins: [SaveStateMixin, StoreMixin, QueryParamsMixin],

  statics: {
    // Static life cycle method from react router, that will be called
    // 'when a handler is about to render', i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return Object.assign({}, DEFAULT_FILTER_OPTIONS, {
      isKServiceFormModalShown: false
    });
  },

  componentWillMount: function () {
    this.store_listeners = [{name: 'dcos', events: ['change']}];
  },

  componentDidMount: function () {
    let {state} = this;
    Object.keys(DEFAULT_FILTER_OPTIONS).forEach((saveStateKey) => {
      const queryParams = this.getQueryParamObject();
      let saveStateValue = state[saveStateKey];
      if (saveStateValue !== queryParams[saveStateKey]) {
        this.setQueryParam(saveStateKey, saveStateValue);
      }
    });
  },

  handleCloseKServiceFormModal: function () {
    this.setState({isKServiceFormModalShown: false});
  },

  handleFilterChange: function (filterValues, filterType) {
    var stateChanges = Object.assign({}, this.state);
    stateChanges[filterType] = filterValues;

    this.setState(stateChanges);
  },

  handleOpenModal: function (id) {
    let modalStates = {
      isKServiceFormModalShown: POD_FORM_MODAL === id
    };

    this.setState(modalStates);
  },

  resetFilterQueryParams: function () {
    let router = this.context.router;
    let queryParams = router.getCurrentQuery();

    Object.values(PodFilterTypes).forEach(function (filterKey) {
      delete queryParams[filterKey];
    });

    router.transitionTo(router.getCurrentPathname(), {}, queryParams);
  },

  resetFilter: function () {
    var state = Object.assign({}, this.state, DEFAULT_FILTER_OPTIONS);
    this.setState(state, this.resetFilterQueryParams);
  },

  getAlertPanelFooter: function () {
    return (
      <div className="button-collection flush-bottom">
        <button className="button button-success"
          onClick={() => this.handleOpenModal(POD_FORM_MODAL)}>
          Deploy Kubernetes Service
        </button>
      </div>
    );
  },

  getContents: function (item) {
    // Render loading screen
    if (!DCOSStore.dataProcessed) {
      return (
        <div className="container container-fluid container-pod text-align-center
            vertical-center inverse">
          <div className="row">
            <div className="ball-scale">
              <div />
            </div>
          </div>
        </div>
      );
    }

    // Render kservice table
    if (item instanceof KServicesList && item.getItems().length > 0) {
      return this.getKServicesListView(item);
    }

    // Render pod detail
    if (item instanceof KService) {
      return (<KServiceDetail kservice={item} />);
    }

    // Render empty panel
    return (
      <div>
        <KServicesBreadcrumb kserviceListItem={item} />
        <AlertPanel
          title="No Services Deployed"
          footer={this.getAlertPanelFooter()}
          iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-services flush-top">
          <p className="flush-bottom">
            Deploy a new kubernetes service.
          </p>
        </AlertPanel>
      </div>
    );
  },

  getHeadline: function (item, filteredKServices) {
    let {state} = this;
    let kservices = item.getItems();

    const hasFiltersApplied = Object.keys(DEFAULT_FILTER_OPTIONS)
      .some((filterKey) => {
        return state[filterKey] != null && state[filterKey].length > 0;
      });

    if (hasFiltersApplied) {
      return (
        <FilterHeadline
          inverseStyle={true}
          onReset={this.resetFilter}
          name="kubernetes services"
          currentLength={filteredKServices.length}
          totalLength={kservices.length} />
      );
    }

    return (
      <KServicesBreadcrumb kserviceListItem={item} />
    );
  },

  getKServicesListView(item) {
    let {state} = this;
    // let pods = item.getItems();
    let filteredKServices = item.filterItemsByFilter({
      id: state.searchString
    }).getItems();

    return (
      <div className="flex-box flush flex-mobile-column">
        <div className="flex-grow">
          {this.getHeadline(item, filteredKServices)}
          <FilterBar rightAlignLastNChildren={1}>
            <PodSearchFilter
              handleFilterChange={this.handleFilterChange} />
            <button className="button button-success"
              onClick={() => this.handleOpenModal(POD_FORM_MODAL)}>
              Deploy Kubernetes Service
            </button>
          </FilterBar>
          <KServicesTable
            kservices={filteredKServices} />
        </div>
        <SidePanels
          params={this.props.params}
          openedPage="services"/>
      </div>
    );
  },

  render: function () {
    let item = DCOSStore.kserviceList;
    let {name, namespace} = this.props.params;

    if (name && namespace) {
      item = DCOSStore.kserviceList.findItemByNameAndNamespace(name, namespace);
      if (item === undefined) {
        return this.getNotFound(name, namespace);
      }
    }

    return (
      <div>
        {this.getContents(item)}
        <KServiceFormModal open={this.state.isKServiceFormModalShown}
          onClose={this.handleCloseKServiceFormModal}/>
      </div>
    );
  }

});

module.exports = KServicesTab;
