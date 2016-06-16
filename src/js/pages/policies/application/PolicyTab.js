import React from 'react';
// import {RouteHandler} from 'react-router';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AlertPanel from '../../../components/AlertPanel';
import DCOSStore from '../../../stores/DCOSStore';
import FilterBar from '../../../components/FilterBar';
import FilterHeadline from '../../../components/FilterHeadline';
import QueryParamsMixin from '../../../mixins/QueryParamsMixin';
import SaveStateMixin from '../../../mixins/SaveStateMixin';
import {
  POLICY_FORM_MODAL
} from '../../../constants/ModalKeys';
// import Policy from '../../../structs/Policy';
import PolicyList from '../../../structs/PolicyList';
// import PolicyDetail from '../../../components/PolicyDetail';
import PolicyFormModal from '../../../components/modals/PolicyFormModal';
import PolicySearchFilter from '../../../components/PolicySearchFilter';
import PoliciesBreadcrumb from '../../../components/PoliciesBreadcrumb';
import PoliciesTable from '../../../components/PoliciesTable';
import SidebarActions from '../../../events/SidebarActions';
import SidePanels from '../../../components/SidePanels';

var DEFAULT_FILTER_OPTIONS = {
  filterNamespace: '',
  searchString: ''
};

let saveState_properties = Object.keys(DEFAULT_FILTER_OPTIONS);

var PolicyTab = React.createClass({

  displayName: 'PolicyTab',

  saveState_key: 'policyPage',

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
      isPolicyFormModalShown: false
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

  handleClosePolicyFormModal: function () {
    this.setState({isPolicyFormModalShown: false});
  },

  handleFilterChange: function (filterValues, filterType) {
    var stateChanges = Object.assign({}, this.state);
    stateChanges[filterType] = filterValues;

    this.setState(stateChanges);
  },

  handleOpenModal: function (id) {
    let modalStates = {
      isPolicyFormModalShown: POLICY_FORM_MODAL === id
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
          onClick={() => this.handleOpenModal(POLICY_FORM_MODAL)}>
          Define Policies
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

    // Render policy table
    if (item instanceof PolicyList && item.getItems().length > 0) {
      return this.getPolicyListView(item);
    }

    // Render empty panel
    return (
      <div>
        <PoliciesBreadcrumb policyListItem={item} />
        <AlertPanel
          title="No Policy Found"
          footer={this.getAlertPanelFooter()}
          iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-services flush-top">
          <p className="flush-bottom">
            Define a new policy.
          </p>
        </AlertPanel>
      </div>
    );
  },

  getHeadline: function (policies, filteredPolices) {
    let {state} = this;

    const hasFiltersApplied = Object.keys(DEFAULT_FILTER_OPTIONS)
      .some((filterKey) => {
        return state[filterKey] != null && state[filterKey].length > 0;
      });

    if (hasFiltersApplied) {
      return (
        <FilterHeadline
          inverseStyle={true}
          onReset={this.resetFilter}
          name="Policies"
          currentLength={filteredPolices.length}
          totalLength={policies.length} />
      );
    }

    return (
      <PoliciesBreadcrumb policyListItem={policies} />
    );
  },

  getPolicyListView(item) {
    let {state} = this;
    let filteredPolicies = item.filter({
      name: state.searchString
    }).getItems();

    return (
      <div className="flex-box flush flex-mobile-column">
        <div className="flex-grow">
          {this.getHeadline(item, filteredPolicies)}
          <FilterBar rightAlignLastNChildren={1}>
            <PolicySearchFilter
              handleFilterChange={this.handleFilterChange} />
            <button className="button button-success"
              onClick={() => this.handleOpenModal(POLICY_FORM_MODAL)}>
              Define Policy
            </button>
          </FilterBar>
          <PoliciesTable
            policies={filteredPolicies} />
        </div>
        <SidePanels
          params={this.props.params}
          openedPage="policies"/>
      </div>
    );
  },

  render: function () {
    let {state} = this;
    let policyList = DCOSStore.policyList;

    return (
      <div>
        {this.getContents(policyList)}
        <PolicyFormModal open={state.isPolicyFormModalShown}
          onClose={this.handleClosePolicyFormModal}/>
      </div>
    );
  }

});

module.exports = PolicyTab;
