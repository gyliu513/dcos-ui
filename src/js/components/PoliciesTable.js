// import {Link} from 'react-router';
var React = require('react');

var EventTypes = require('../constants/EventTypes');
import {Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
import KubernetesStore from '../stores/KubernetesStore';

var ResourceTableUtil = require('../utils/ResourceTableUtil');

var PolicyTableHeaderLabels = {
  name: 'Name',
  creationTimestamp: 'CreationTimestamp',
  targetCPUUtilization: 'TargetCPUUtilization',
  minReplicas: 'MinReplicas',
  maxReplicas: 'MaxReplicas'
};

var PoliciesTable = React.createClass({

  displayName: 'PoliciesTable',

  propTypes: {
    policies: React.PropTypes.array.isRequired
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

  getRows: function (policies) {
    let newRows = [];

    for (var i = 0; i < policies.length; i++) {
      var rowObj = {};
      rowObj.name = policies[i].metadata.name;
      rowObj.creationTimestamp = policies[i].metadata.creationTimestamp;
      rowObj.targetCPUUtilization = policies[i].spec.targetCPUUtilizationPercentage;
      rowObj.minReplicas = policies[i].spec.minReplicas;
      rowObj.maxReplicas = policies[i].spec.maxReplicas;
      newRows.push(rowObj);
    }

    return newRows;
  },

  getColumns: function () {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(PolicyTableHeaderLabels);

    return [
      {
        className,
        headerClassName: className,
        prop: 'name',
        render: this.renderHeadline,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'creationTimestamp',
        sortable: false,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'targetCPUUtilization',
        sortable: false,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'minReplicas',
        sortable: false,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'maxReplicas',
        sortable: false,
        heading
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col className="status-bar-column"/>
        <col style={{width: '100px'}} />
        <col style={{width: '150px'}} />
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
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'asc'}} />
      </div>
    );
  }
});

module.exports = PoliciesTable;
