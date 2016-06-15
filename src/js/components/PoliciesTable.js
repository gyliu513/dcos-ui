import {Link} from 'react-router';
var React = require('react');

var EventTypes = require('../constants/EventTypes');
import {Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';

var PolicyTableHeaderLabels = {
  name: 'Name',
  namespace: 'Namespace',
  creationTimestamp: 'CreationTimestamp'
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
        <Link to="application-policy-detail"
          className="headline table-cell-value flex-box flex-box-col"
          params={policy}>
          <span className="text-overflow">
            {policy.name}
          </span>
        </Link>
      </div>
    );
  },

  getRows: function (policies) {
    let newRows = [];
    for (var i = 0; i < policies.length; i++) {
      var rowObj = {};
      rowObj.name = policies[i].metadata.name;
      rowObj.namespace = policies[i].metadata.namespace;
      rowObj.creationTimestamp = policies[i].metadata.creationTimestamp;
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
        prop: 'namespace',
        sortable: false,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'creationTimestamp',
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
