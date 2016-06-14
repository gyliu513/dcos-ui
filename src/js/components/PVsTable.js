import {Link} from 'react-router';
var React = require('react');

import Cluster from '../utils/Cluster';
var EventTypes = require('../constants/EventTypes');
import Framework from '../structs/Framework';
import HealthBar from './HealthBar';
import IconNewWindow from './icons/IconNewWindow';
var MarathonStore = require('../stores/MarathonStore');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var PVTableHeaderLabels = require('../constants/PVTableHeaderLabels');
// import ServiceTableUtil from '../utils/ServiceTableUtil';
// import ServiceTree from '../structs/ServiceTree';
import StringUtil from '../utils/StringUtil';
import {Table} from 'reactjs-components';
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
      rowObj.server = data[i].spec.nfs.server;
      rowObj.path = data[i].spec.nfs.path;
      newRows.push(rowObj);
    }

    return newRows;
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
        prop: 'server',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'path',
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
          data={this.getRows(this.props.services.slice())}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'asc'}} />
      </div>
    );
  }
});

module.exports = PVsTable;
