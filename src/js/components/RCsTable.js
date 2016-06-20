import {Link} from 'react-router';
var React = require('react');

import Cluster from '../utils/Cluster';
var EventTypes = require('../constants/EventTypes');
import Framework from '../structs/Framework';
import HealthBar from './HealthBar';
import IconNewWindow from './icons/IconNewWindow';
import Config from '../config/Config';
import KubernetesStore from '../stores/KubernetesStore';
var MarathonStore = require('../stores/MarathonStore');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var RCTableHeaderLabels = require('../constants/RCTableHeaderLabels');
// import ServiceTableUtil from '../utils/ServiceTableUtil';
// import ServiceTree from '../structs/ServiceTree';
import StringUtil from '../utils/StringUtil';
import {Confirm, Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
var Units = require('../utils/Units');

const StatusMapping = {
  'Running': 'running-state'
};

var RCsTable = React.createClass({

  displayName: 'RCsTable',

  propTypes: {
    services: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    this.store_listeners = [{
      name: 'kubernetes',
      events: ['rcDeleteError', 'rcDeleteSuccess'],
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    }];

    return {
      rcToRemove: null,
      rcRemoveError: null,
      pendingRequest: false
    };
  },

  onKubernetesStoreRcDeleteError: function (error) {
    console.log(234325343);
    this.setState({rcRemoveError: error, pendingRequest: false});
  },

  onKubernetesStoreRcDeleteSuccess: function () {
    this.setState({
      rcToRemove: null,
      rcRemoveError: null,
      pendingRequest: false
    });
    KubernetesStore.fetchReplicationControllers();
  },

  componentDidMount: function () {
    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonAppsChange
    );
  },

  componentWillUnmount: function () {
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonAppsChange
    );
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  getOpenInNewWindowLink(service) {
    if (!(service instanceof Framework) || !service.getWebURL()) {
      return null;
    }

    return (
      <a className="table-display-on-row-hover"
        href={Cluster.getServiceLink(service.getName())} target="_blank"
        title="Open in a new window">
        <IconNewWindow className="icon icon-new-window icon-align-right
          icon-margin-wide" />
      </a>
    );
  },

  onMarathonAppsChange: function () {
    this.forceUpdate();
  },

  renderHeadline: function (prop, rc) {
    return (
      <div className="service-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <Link to="services-rcs"
          className="headline table-cell-value flex-box flex-box-col"
          params={rc}>
          <span className="text-overflow">
            {rc.name}
          </span>
        </Link>
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

  getRows: function (data) {
    let newRows = [];
    for (var i = 0; i < data.length; i++) {
      var rowObj = {};
      rowObj.name = data[i].metadata.name;
      rowObj.namespace = data[i].metadata.namespace;
      rowObj.labels = data[i].metadata.labels.app;
      rowObj.pods = data[i].spec.replicas;
      rowObj.createTime = data[i].metadata.creationTimestamp;
      rowObj.endpoints = data[i].metadata.uid;
      rowObj.images = data[i].metadata.name;
      newRows.push(rowObj);
    }

    return newRows;
  },

  handleOpenConfirm: function (rcToRemove) {
    this.setState({rcToRemove});
  },

  handleDeleteCancel: function () {
    this.setState({rcToRemove: null});
  },

  handleDeleteReplicationController: function () {
    let {rcToRemove} = this.state;
    KubernetesStore.deleteReplicationController(rcToRemove.namerspace, rcToRemove.name);
    this.setState({pendingRequest: true});
  },

  getRemoveButton: function (prop, rcToRemove) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, rcToRemove)}>
          Remove
        </a>
      </div>
    );
  },

  getColumns: function () {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(RCTableHeaderLabels);

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
        prop: 'labels',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'pods',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'createTime',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'endpoints',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'images',
        sortable: true,
        heading
      },
      {
        className,
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
        <col style={{width: '100px'}} />
        <col />
        <col />
        <col />
        <col style={{width: '85px'}} />
      </colgroup>
    );
  },

  getRemoveModalContent: function () {
    let {rcRemoveError, rcToRemove} = this.state;
    let rcLabel = 'This Replication Controller';
    if (rcToRemove && rcToRemove.name) {
      rcLabel = rcToRemove.name;
    }

    let error = null;

    if (rcRemoveError != null) {
      error = (
        <p className="text-error-state">{rcRemoveError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`Replication Controller (${rcLabel}) will be removed from ${Config.productName}. You will not be able to use it anymore.`}
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
          data={this.getRows(this.props.rcs.slice())}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'asc'}} />
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.rcToRemove}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeleteReplicationController}
          rightButtonClassName="button button-danger"
          rightButtonText="Remove RC">
          {this.getRemoveModalContent()}
        </Confirm>
      </div>
    );
  }
});

module.exports = RCsTable;
