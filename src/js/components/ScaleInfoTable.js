var React = require('react');

var EventTypes = require('../constants/EventTypes');
import Table from 'reactjs-components';
// import TableUtil from '../utils/TableUtil';
import HealthBar from './HealthBar';
import KubernetesStore from '../stores/KubernetesStore';

// var ResourceTableUtil = require('../utils/ResourceTableUtil');

// var ScaleInfoTableHeaderLabels = {
//   name: 'Name',
//   currentReplicas: 'CurrentReplicas',
//   desiredReplicas: 'DesiredReplicas',
//   lastScaleTime: 'LastScaleTime',
// };

var ScaleInfoTable = React.createClass({

  displayName: 'ScaleInfoTable',

  propTypes: {
    policies: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    this.store_listeners = [{
      name: 'cosmosPackages',
      events: ['repositoryDeleteError', 'repositoryDeleteSuccess'],
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    }];

    return {
      pvToRemove: null,
      pvRemoveError: null,
      pendingRequest: false
    };
  },

  componentDidMount: function () {
    KubernetesStore.addChangeListener(
      EventTypes.KUBERNETES_POLICIES_CHANGE,
      this.onKubernetesPoliciesChange
    );
  },

  componentWillUnmount: function () {
    KubernetesStore.removeChangeListener(
      EventTypes.KUBERNETES_POLICIES_CHANGE,
      this.onKubernetesPoliciesChange
    );
  },

  getDefaultProps: function () {
    return {
      policies: []
    };
  },

  onKubernetesPoliciesChange: function () {
    this.forceUpdate();
  },

  renderHeadline: function (prop, policy) {
    return (
      <div className="service-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <span className="text-overflow">
          {policy.name}
        </span>
      </div>
    );
  },

  renderStatus: function (prop, service) {
    let instanceCount = service.getInstancesCount();
    let serviceStatus = service.getStatus();
    let serviceStatusClassSet = StatusMapping[serviceStatus] || '';
    let taskSummary = service.getTasksSummary();
    let {tasksRunning} = taskSummary;

    let text = ` (${tasksRunning} ${StringUtil.pluralize('Task', tasksRunning)})`;
    if (tasksRunning !== instanceCount) {
      text = ` (${tasksRunning} of ${instanceCount} Tasks)`;
    }

    return (
      <div className="status-bar-wrapper media-object media-object-spacing-wrapper media-object-spacing-narrow media-object-offset">
        <span className="media-object-item flush-bottom">
          <HealthBar tasksSummary={taskSummary} instancesCount={instanceCount} />
        </span>
        <span className="media-object-item flush-bottom visible-large-inline-block">
          <span className={serviceStatusClassSet}>{serviceStatus}</span>
          {text}
        </span>
      </div>
    );
  },

  renderStats: function (prop, service) {
    return (
      <span>
        {Units.formatResource(prop, service.getResources()[prop])}
      </span>
    );
  },

  getRows: function (policies) {
    let newRows = [];

    for (var i = 0; i < policies.length; i++) {
      var rowObj = {};
      rowObj.name = policies[i].metadata.name;
      rowObj.currentReplicas = policies[i].status.currentReplicas;
      rowObj.desiredReplicas = policies[i].status.desiredReplicas;
      rowObj.lastScaleTime = 'xxxx';
      newRows.push(rowObj);
    }

    return newRows;
  },

  getColumns: function () {
    // let heading = ResourceTableUtil.renderHeading(ScaleInfoTableHeaderLabels);

    return [
      {
        className: 'ScaleInfoTable',
        prop: 'name',
        heading: 'Name',
        sortable: false,
        defaultContent: 'xxx'
      },
      {
        className: 'ScaleInfoTable',
        prop: 'currentReplicas',
        heading: 'Current Replicas',
        sortable: false,
        defaultContent: 'xxx'
      },
      {
        className: 'ScaleInfoTable',
        prop: 'desiredReplicas',
        heading: 'Desired Replicas',
        sortable: false,
        defaultContent: 'xxx'
      },
      {
        className: 'ScaleInfoTable',
        prop: 'lastScaleTime',
        heading: 'Last ScaleTime',
        sortable: false,
        defaultContent: 'xxx'
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col style={{width: '100px'}} />
        <col style={{width: '110px'}} />
        <col style={{width: '110px'}} />
      </colgroup>
    );
  },

  render: function () {
    return (
      <div>
        <Table
          buildRowOptions={this.getRowAttributes}
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.getRows(this.props.policies.slice())}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view" />
      </div>
    );
  }
});

module.exports = ScaleInfoTable;
