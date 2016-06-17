// import {Link} from 'react-router';
var React = require('react');

var EventTypes = require('../constants/EventTypes');
import {Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
import KubernetesStore from '../stores/KubernetesStore';

var ResourceTableUtil = require('../utils/ResourceTableUtil');

var PolicyLogTableHeaderLabels = {
  Id: 'ID',
  name: 'Name',
  keyWords: 'Key Name',
  cycle: 'Cycle',
  times: 'Times',
  contact: 'Contact',
  enable: 'Enable',
  updateTime: 'Update Time',
  creationTimestamp: 'CreationTimestamp',
  targetCPUUtilization: 'TargetCPUUtilization',
  minReplicas: 'MinReplicas',
  maxReplicas: 'MaxReplicas'
};

var PoliciesLogTable = React.createClass({

  displayName: 'PoliciesLogTable',

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
      rowObj.enable = 'yes';
      rowObj.keyWords = 'keyWords';
      rowObj.cycle = '30mins',
      rowObj.contact = 'star',
      rowObj.updateTime = 'null',
      rowObj.targetCPUUtilization = policies[i].spec.targetCPUUtilizationPercentage;
      rowObj.minReplicas = policies[i].spec.minReplicas;
      rowObj.maxReplicas = policies[i].spec.maxReplicas;
      newRows.push(rowObj);
      newRows.push(rowObj);
      newRows.push(rowObj);
    }

    return newRows;
  },

  getColumns: function () {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(PolicyLogTableHeaderLabels);

    return [
      {
        className,
        headerClassName: className,
        prop: 'Id',
        render: this.renderHeadline,
        sortable: true,
        heading
      },
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
        prop: 'keyWords',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'cycle',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'times',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'contact',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'enable',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'updateTime',
        sortable: true,
        heading
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col className="status-bar-column"/>
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

module.exports = PoliciesLogTable;
