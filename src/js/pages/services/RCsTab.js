import React from 'react';
import {RouteHandler} from 'react-router';
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
import Pod from '../../structs/Pod';
import PodDetail from '../../components/PodDetail';
import PodFilterTypes from '../../constants/PodFilterTypes';
import RCFormModal from '../../components/modals/RCFormModal';
import PodSearchFilter from '../../components/PodSearchFilter';
// import PodSidebarFilters from '../../components/PodSidebarFilters';
import RCsBreadcrumb from '../../components/RCsBreadcrumb';
import RCsTable from '../../components/RCsTable';
import RCTree from '../../structs/RCTree';
import SidebarActions from '../../events/SidebarActions';
import SidePanels from '../../components/SidePanels';

var DEFAULT_FILTER_OPTIONS = {
  filterHealth: null,
  searchString: ''
};

let saveState_properties = Object.keys(DEFAULT_FILTER_OPTIONS);

var PodsTab = React.createClass({

  displayName: 'PodsTab',

  saveState_key: 'podsPage',

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
      isRCFormModalShown: false
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

  handleCloseRCFormModal: function () {
    this.setState({isRCFormModalShown: false});
  },

  handleFilterChange: function (filterValues, filterType) {
    var stateChanges = Object.assign({}, this.state);
    stateChanges[filterType] = filterValues;

    this.setState(stateChanges);
  },

  handleOpenModal: function (id) {
    let modalStates = {
      isRCFormModalShown: POD_FORM_MODAL === id
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
          Deploy Replication Controller
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

    if (this.props.params.name && this.props.params.namespace) {
      return (
        <RouteHandler />
      );
    }

    // Render pod table
    if (item instanceof RCTree && item.getItems().length > 0) {
      return this.getRCTreeView(item);
    }

    // Render pod detail
    if (item instanceof Pod) {
      return (<PodDetail service={item} />);
    }

    // Render empty panel
    return (
      <div>
        <RCsBreadcrumb rcTreeItem={item} />
        <AlertPanel
          title="No Replication Controllers Deployed"
          footer={this.getAlertPanelFooter()}
          iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-services flush-top">
          <p className="flush-bottom">
            Deploy a new Replication Controller.
          </p>
        </AlertPanel>
      </div>
    );
  },

  getHeadline: function (item, filteredRCs) {
    let {state} = this;
    let rcs = item.getItems();

    const hasFiltersApplied = Object.keys(DEFAULT_FILTER_OPTIONS)
      .some((filterKey) => {
        return state[filterKey] != null && state[filterKey].length > 0;
      });

    if (hasFiltersApplied) {
      return (
        <FilterHeadline
          inverseStyle={true}
          onReset={this.resetFilter}
          name="Replication Controllers"
          currentLength={filteredRCs.length}
          totalLength={rcs.length} />
      );
    }

    return (
      <RCsBreadcrumb rcTreeItem={item} />
    );
  },

  getRCTreeView(item) {
    let {state} = this;
    // let pods = item.getItems();
    let filteredRCs = item.filterItemsByFilter({
      health: state.filterHealth,
      id: state.searchString
    }).getItems();

    return (
      <div className="flex-box flush flex-mobile-column">
        <div className="flex-grow">
          {this.getHeadline(item, filteredRCs)}
          <FilterBar rightAlignLastNChildren={1}>
            <PodSearchFilter
              handleFilterChange={this.handleFilterChange} />
            <button className="button button-success"
              onClick={() => this.handleOpenModal(POD_FORM_MODAL)}>
              Deploy Replication Controller
            </button>
          </FilterBar>
          <RCsTable
            rcs={filteredRCs} />
        </div>
        <SidePanels
          params={this.props.params}
          openedPage="services"/>
      </div>
    );
  },

  render: function () {
    let {id} = this.props.params;
    id = decodeURIComponent(id);
    let {state} = this;

    // Find item in root tree and default to root tree if there is no match
    // let item = DCOSStore.serviceTree.findItemById(id) || DCOSStore.serviceTree;
    let item = DCOSStore.rcTree.findItemById(id) || DCOSStore.rcTree;

    return (
      <div>
        {this.getContents(item)}
        <RCFormModal open={state.isRCFormModalShown}
          onClose={this.handleCloseRCFormModal}/>
      </div>
    );
  }

});

module.exports = PodsTab;
