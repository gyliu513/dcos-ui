import {Link} from 'react-router';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Config from '../config/Config';
import KubernetesStore from '../stores/KubernetesStore';
import {Confirm, Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';

var React = require('react');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var RCTableHeaderLabels = require('../constants/RCTableHeaderLabels');

const METHODS_TO_BIND = [
  'getRemoveButton',
  'handleDeleteCancel',
  'handleDeleteReplicationController',
  'handleOpenConfirm'
];

class RCsTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      rcToRemove: null,
      rcRemoveError: null,
      pendingRequest: false
    };

    this.store_listeners = [{
      name: 'kubernetes',
      events: ['rcDeleteError', 'rcDeleteSuccess'],
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onKubernetesStoreRcDeleteError(error) {
    this.setState({rcRemoveError: error, pendingRequest: false});
  }

  onKubernetesStoreRcDeleteSuccess() {
    this.setState({
      rcToRemove: null,
      rcRemoveError: null,
      pendingRequest: false
    });
    KubernetesStore.fetchReplicationControllers();
  }

  renderHeadline(prop, rc) {
    return (
      <div className="service-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <Link to="services-rcs-detail"
          className="headline table-cell-value flex-box flex-box-col"
          params={rc}>
          <span className="text-overflow">
            {rc.name}
          </span>
        </Link>
      </div>
    );
  }

  getRows(data) {
    let newRows = [];
    for (var i = 0; i < data.length; i++) {
      var rowObj = {};
      rowObj.name = data[i].metadata.name;
      rowObj.namespace = data[i].metadata.namespace;
      rowObj.labels = data[i].metadata.labels.app;
      rowObj.current = data[i].spec.replicas;
      rowObj.desired = data[i].status.replicas;
      rowObj.createTime = data[i].metadata.creationTimestamp;
      rowObj.images = data[i].metadata.name;
      newRows.push(rowObj);
    }

    return newRows;
  }

  handleOpenConfirm(rcToRemove) {
    this.setState({rcToRemove});
  }

  handleDeleteCancel() {
    this.setState({rcToRemove: null});
  }

  handleDeleteReplicationController() {
    let {rcToRemove} = this.state;
    KubernetesStore.deleteReplicationController(rcToRemove.namespace, rcToRemove.name);
    this.setState({pendingRequest: true});
  }

  getRemoveButton(prop, rcToRemove) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, rcToRemove)}>
          Remove
        </a>
      </div>
    );
  }

  getColumns() {
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
        prop: 'namespace',
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
        prop: 'desired',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'current',
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
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col />
        <col />
        <col style={{width: '100px'}} />
        <col />
        <col />
        <col />
        <col style={{width: '85px'}} />
      </colgroup>
    );
  }

  getRemoveModalContent() {
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
  }

  render() {
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
}

RCsTable.propTypes = {
  rcs: React.PropTypes.array.isRequired
};

module.exports = RCsTable;
