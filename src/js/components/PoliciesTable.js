var React = require('react');

var EventTypes = require('../constants/EventTypes');
import {Confirm, Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
import KubernetesStore from '../stores/KubernetesStore';

var ResourceTableUtil = require('../utils/ResourceTableUtil');

var PolicyTableHeaderLabels = require('../constants/PolicyTableHeaderLabels');

var PoliciesTable = React.createClass({

  displayName: 'PoliciesTable',

  propTypes: {
    policies: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      policyToRemove: null,
      policyRemoveError: null,
      pendingRequest: false
    };
  },

  componentDidMount: function () {
    KubernetesStore.addChangeListener(
      EventTypes.KUBERNETES_POLICIES_CHANGE,
      this.onKubernetesPoliciesChange
    );
    KubernetesStore.addChangeListener(
      EventTypes.KUBERNETES_POLICY_DELETE_SUCCESS,
      this.onKubernetesStorePolicyDeleteSuccess
    );
    KubernetesStore.addChangeListener(
      EventTypes.KUBERNETES_POLICY_DELETE_ERROR,
      this.onKubernetesStorePolicyDeleteError
    );
  },

  componentWillUnmount: function () {
    KubernetesStore.removeChangeListener(
      EventTypes.KUBERNETES_POLICIES_CHANGE,
      this.onKubernetesPoliciesChange
    );
    KubernetesStore.removeChangeListener(
      EventTypes.KUBERNETES_POLICY_DELETE_SUCCESS,
      this.onKubernetesStorePolicyDeleteSuccess
    );
    KubernetesStore.removeChangeListener(
      EventTypes.KUBERNETES_POLICY_DELETE_ERROR,
      this.onKubernetesStorePolicyDeleteError
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

  onKubernetesStorePolicyDeleteError: function (error) {
    this.setState({policyRemoveError: error, pendingRequest: false});
  },

  onKubernetesStorePolicyDeleteSuccess: function () {
    this.setState({
      policyToRemove: null,
      policyRemoveError: null,
      pendingRequest: false
    });
    this.forceUpdate();
  },

  handleOpenConfirm: function (policyToRemove) {
    this.setState({policyToRemove});
  },

  handleDeleteCancel: function () {
    this.setState({policyToRemove: null});
  },

  handleDeletePolicy: function () {
    let {policyToRemove} = this.state;
    KubernetesStore.deletePolicy(
      policyToRemove.name,
      policyToRemove.namespace
    );

    this.setState({pendingRequest: true});
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
      rowObj.namespace = policies[i].metadata.namespace;
      rowObj.reference = policies[i].spec.scaleTargetRef.kind + '/'
      + policies[i].spec.scaleTargetRef.name;
      rowObj.targetCPUUtilization = policies[i].spec.targetCPUUtilizationPercentage;
      rowObj.currentCPUUtilization = policies[i].status.currentCPUUtilizationPercentage;
      rowObj.minReplicas = policies[i].spec.minReplicas;
      rowObj.maxReplicas = policies[i].spec.maxReplicas;
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
        prop: 'reference',
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
        prop: 'currentCPUUtilization',
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
      },
      {
        className,
        headerClassName: className,
        prop: 'creationTimestamp',
        sortable: false,
        heading
      },
      {
        className: className,
        headerClassName: className,
        heading: function () {},
        prop: 'removed',
        render: this.getRemoveButton,
        sortable: false
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
    );
  },

  getRemoveButton: function (prop, policyToRemove) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, policyToRemove)}>
          Remove
        </a>
      </div>
    );
  },

  getRemoveModalContent: function () {
    let {policyRemoveError, policyToRemove} = this.state;
    let policyLabel = 'This policy';
    if (policyToRemove && policyToRemove.name) {
      policyLabel = policyToRemove.name;
    }

    let error = null;

    if (policyRemoveError != null) {
      error = (
        <p className="text-error-state">{policyRemoveError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`Policy (${policyLabel}) will be removed.`}
        </p>
        {error}
      </div>
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
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.policyToRemove}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeletePolicy}
          rightButtonClassName="button button-danger"
          rightButtonText="Remove Policy">
          {this.getRemoveModalContent()}
        </Confirm>
      </div>
    );
  }
});

module.exports = PoliciesTable;
