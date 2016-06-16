import {Link} from 'react-router';
var React = require('react');

import Config from '../config/Config';
import Cluster from '../utils/Cluster';
var EventTypes = require('../constants/EventTypes');
import Framework from '../structs/Framework';
import HealthBar from './HealthBar';
import IconNewWindow from './icons/IconNewWindow';
import KubernetesStore from '../stores/KubernetesStore';
var MarathonStore = require('../stores/MarathonStore');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var PVTableHeaderLabels = require('../constants/PVTableHeaderLabels');
import StringUtil from '../utils/StringUtil';
import {Confirm, Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
var Units = require('../utils/Units');

const StatusMapping = {
  'Running': 'running-state'
};

var PVsTable = React.createClass({

  displayName: 'PVsTable',

  propTypes: {
    services: React.PropTypes.array.isRequired
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

  renderHeadline: function (prop, pv) {
    return (
      <div className="service-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <Link to="storage-pvs-detail"
          className="headline table-cell-value flex-box flex-box-col"
          params={pv}>
          <span className="text-overflow">
            {pv.name}
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
      rowObj.status = data[i].status.phase;
      rowObj.capacity = data[i].spec.capacity.storage;
      rowObj.accessmodes = data[i].spec.accessModes[0];
      if (data[i].spec.claimRef.namespace && data[i].spec.claimRef.name) {
        rowObj.claim = data[i].spec.claimRef.namespace + '/' + data[i].spec.claimRef.name;
      } else {
        rowObj.claim = '';
      }
      newRows.push(rowObj);
    }

    return newRows;
  },

  handleOpenConfirm: function (pvToRemove) {
    this.setState({pvToRemove});
  },

  handleDeleteCancel: function () {
    this.setState({pvToRemove: null});
  },

  handleDeletePV: function () {
    let {pvToRemove} = this.state;
    KubernetesStore.removePV(pvToRemove.name);
    this.setState({pendingRequest: true});
  },

  getRemoveButton: function (prop, pvToRemove) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, pvToRemove)}>
          Remove
        </a>
      </div>
    );
  },

  getColumns: function () {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(PVTableHeaderLabels);

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
        prop: 'status',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'capacity',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'accessmodes',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'claim',
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
        <col className="status-bar-column"/>
        <col style={{width: '150px'}} />
        <col style={{width: '150px'}} />
        <col style={{width: '150px'}} />
        <col style={{width: '85px'}} />
      </colgroup>
    );
  },

  getRemoveModalContent: function () {
    let {pvRemoveError, pvToRemove} = this.state;
    let pvLabel = 'This Persisten Volume';
    if (pvToRemove && pvToRemove.name) {
      pvLabel = pvToRemove.name;
    }

    let error = null;

    if (pvRemoveError != null) {
      error = (
        <p className="text-error-state">{pvRemoveError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`Persisten Volume (${pvLabel}) will be removed from ${Config.productName}. You will not be able to use it anymore.`}
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
          data={this.getRows(this.props.services.slice())}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'asc'}} />
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.pvToRemove}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeletePV}
          rightButtonClassName="button button-danger"
          rightButtonText="Remove PV">
          {this.getRemoveModalContent()}
        </Confirm>
      </div>
    );
  }
});

module.exports = PVsTable;
