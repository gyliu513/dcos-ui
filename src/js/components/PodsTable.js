import {Link} from 'react-router';
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Config from '../config/Config';
import KubernetesStore from '../stores/KubernetesStore';
import {Confirm, Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';

var React = require('react');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var PodTableHeaderLabels = require('../constants/PodTableHeaderLabels');

const METHODS_TO_BIND = [
  'getRemoveButton',
  'handleDeleteCancel',
  'handleDeletePod',
  'handleOpenConfirm'
];

class PodsTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      podToRemove: null,
      podRemoveError: null,
      pendingRequest: false
    };

    this.store_listeners = [{
      name: 'kubernetes',
      events: ['podDeleteError', 'podDeleteSuccess'],
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onKubernetesStorePodDeleteError(error) {
    this.setState({podRemoveError: error, pendingRequest: false});
  }

  onKubernetesStorePodDeleteSuccess() {
    this.setState({
      podToRemove: null,
      podRemoveError: null,
      pendingRequest: false
    });
    KubernetesStore.fetchPods();
  }

  renderHeadline(prop, pod) {
    return (
      <div className="service-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <Link to="services-pods-detail"
          className="headline table-cell-value flex-box flex-box-col"
          params={pod}>
          <span className="text-overflow">
            {pod.name}
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
      rowObj.status = data[i].status.phase;
      rowObj.restartCount = data[i].status.containerStatuses[0].restartCount;
      rowObj.podIP = data[i].status.podIP;
      newRows.push(rowObj);
    }

    return newRows;
  }

  handleOpenConfirm(podToRemove) {
    this.setState({podToRemove});
  }

  handleDeleteCancel() {
    this.setState({podToRemove: null});
  }

  handleDeletePod() {
    let {podToRemove} = this.state;
    KubernetesStore.deletePod(podToRemove.namespace, podToRemove.name);
    this.setState({pendingRequest: true});
  }

  getRemoveButton(prop, podToRemove) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, podToRemove)}>
          Remove
        </a>
      </div>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(PodTableHeaderLabels);

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
        prop: 'status',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'restartCount',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'podIP',
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
        <col style={{width: '150px'}} />
        <col style={{width: '85px'}} />
      </colgroup>
    );
  }

  getRemoveModalContent() {
    let {podRemoveError, podToRemove} = this.state;
    let podLabel = 'This Pod';
    if (podToRemove && podToRemove.name) {
      podLabel = podToRemove.name;
    }

    let error = null;

    if (podRemoveError != null) {
      error = (
        <p className="text-error-state">{podRemoveError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`Pod (${podLabel}) will be removed from ${Config.productName}. You will not be able to use it anymore.`}
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
          data={this.getRows(this.props.pods.slice())}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'asc'}} />
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.podToRemove}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeletePod}
          rightButtonClassName="button button-danger"
          rightButtonText="Remove Pod">
          {this.getRemoveModalContent()}
        </Confirm>
      </div>
    );
  }
}

PodsTable.propTypes = {
  pods: React.PropTypes.array.isRequired
};

module.exports = PodsTable;
