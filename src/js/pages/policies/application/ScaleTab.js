import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';
import DCOSStore from '../../../stores/DCOSStore';
import FilterBar from '../../../components/FilterBar';
import FilterHeadline from '../../../components/FilterHeadline';
import QueryParamsMixin from '../../../mixins/QueryParamsMixin';
import SaveStateMixin from '../../../mixins/SaveStateMixin';
import SidebarActions from '../../../events/SidebarActions';
import PolicySearchFilter from '../../../components/PolicySearchFilter';
// import ScaleInfoTable from '../../../components/ScaleInfoTable';
import {Table, Tr} from 'reactjs-components';
import TableUtil from '../../../utils/TableUtil';

var DEFAULT_FILTER_OPTIONS = {
  filterHealth: null,
  searchString: ''
};

let saveState_properties = Object.keys(DEFAULT_FILTER_OPTIONS);

var ScaleTab = React.createClass({

  displayName: 'ScaleTab',

  saveState_key: 'scalePage',

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

  handleFilterChange: function (filterValues, filterType) {
    var stateChanges = Object.assign({}, this.state);
    stateChanges[filterType] = filterValues;

    this.setState(stateChanges);
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

  getContents: function (item) {
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

    return this.getPolicyListView(item);
  },

  getHeadline: function (item, filteredPolices) {
    let {state} = this;
    let policies = item.getItems();

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
  },

  getColumns() {
    return [
      {
        className: 'ScaleTab',
        prop: 'name',
        heading: 'Name',
        sortable: false
      },
      {
        className: 'ScaleTab',
        prop: 'currentReplicas',
        heading: 'Current Replicas',
        sortable: false
      },
      {
        className: 'ScaleTab',
        prop: 'desiredReplicas',
        heading: 'Desired Replicas',
        sortable: false
      },
      {
        className: 'ScaleTab',
        prop: 'lastScaleTime',
        heading: 'Last ScaleTime',
        sortable: false
      }
    ];
  },

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col />
        <col />
        <col />
      </colgroup>
    );
  },

  getRows(policies) {
    let newRows = [];

    for (var i = 0; i < policies.length; i++) {
      var rowObj = {};
      rowObj.name = policies[i].metadata.name;
      rowObj.currentReplicas = policies[i].status.currentReplicas;
      rowObj.desiredReplicas = policies[i].status.desiredReplicas;
      rowObj.lastScaleTime = policies[i].status.lastScaleTime;
      newRows.push(rowObj);
    }

    return newRows;
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
          </FilterBar>
          <Table
          buildRowOptions={this.getRowAttributes}
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          itemHeight={TableUtil.getRowHeight()}
          data={this.getRows(filteredPolicies.slice())} >
            <Tr className="special-row"
              data={[]} />
          </Table>
        </div>
      </div>
    );
  },

  render: function () {
    let {id} = this.props.params;
    id = decodeURIComponent(id);
    let items = DCOSStore.policyList;

    return (
      <div>
        {this.getContents(items)}
      </div>
    );
  }

});

module.exports = ScaleTab;
