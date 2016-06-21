import {Link} from 'react-router';
var React = require('react');
import mixin from 'reactjs-mixin';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Config from '../config/Config';
import KubernetesStore from '../stores/KubernetesStore';
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var KServiceTableHeaderLabels = require('../constants/KServiceTableHeaderLabels');
// import ServiceTableUtil from '../utils/ServiceTableUtil';
// import ServiceTree from '../structs/ServiceTree';
import {Confirm, Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = [
  'getRemoveButton',
  'handleDeleteCancel',
  'handleDeleteKService',
  'handleOpenConfirm'
];

class KServicesTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      kserviceToRemove: null,
      kserviceRemoveError: null,
      pendingRequest: false
    };

    this.store_listeners = [{
      name: 'kubernetes',
      events: ['serviceDeleteError', 'serviceDeleteSuccess'],
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onKubernetesStoreServiceDeleteError(error) {
    this.setState({kserviceRemoveError: error, pendingRequest: false});
  }

  onKubernetesStoreServiceDeleteSuccess() {
    this.setState({
      kserviceToRemove: null,
      kserviceRemoveError: null,
      pendingRequest: false
    });
    KubernetesStore.fetchKServices();
  }

  renderHeadline(prop, kservice) {
    return (
      <div className="service-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <Link to="services-kservices"
          className="headline table-cell-value flex-box flex-box-col"
          params={kservice}>
          <span className="text-overflow">
            {kservice.name}
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
      rowObj.labels = data[i].metadata.name;
      rowObj.clusterIP = data[i].spec.clusterIP;
      rowObj.createTime = data[i].metadata.creationTimestamp;
      rowObj.ports = data[i].metadata.uid;
      newRows.push(rowObj);
    }

    return newRows;
  }

  handleOpenConfirm(kserviceToRemove) {
    this.setState({kserviceToRemove});
  }

  handleDeleteCancel() {
    this.setState({kserviceToRemove: null});
  }

  handleDeleteKService() {
    let {kserviceToRemove} = this.state;
    KubernetesStore.deleteKService(kserviceToRemove.namespace, kserviceToRemove.name);
    this.setState({pendingRequest: true});
  }

  getRemoveButton(prop, kserviceToRemove) {
    return (
      <div className="flex-align-right">
        <a
          className="button button-link button-danger table-display-on-row-hover"
          onClick={this.handleOpenConfirm.bind(this, kserviceToRemove)}>
          Remove
        </a>
      </div>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(KServiceTableHeaderLabels);

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
        prop: 'clusterIP',
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
        prop: 'ports',
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
        <col />
        <col />
        <col />
        <col style={{width: '85px'}} />
      </colgroup>
    );
  }

  getRemoveModalContent() {
    let {kserviceRemoveError, kserviceToRemove} = this.state;
    let kserviceLabel = 'This Kubernetes Service';
    if (kserviceToRemove && kserviceToRemove.name) {
      kserviceLabel = kserviceToRemove.name;
    }

    let error = null;

    if (kserviceRemoveError != null) {
      error = (
        <p className="text-error-state">{kserviceRemoveError}</p>
      );
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>
          {`Kubernetes Service (${kserviceLabel}) will be removed from ${Config.productName}. You will not be able to use it anymore.`}
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
          data={this.getRows(this.props.kservices.slice())}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'asc'}} />
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={!!this.state.kserviceToRemove}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeleteKService}
          rightButtonClassName="button button-danger"
          rightButtonText="Remove Kubernetes Service">
          {this.getRemoveModalContent()}
        </Confirm>
      </div>
    );
  }
}

KServicesTable.propTypes = {
  kservices: React.PropTypes.array.isRequired
};

module.exports = KServicesTable;
