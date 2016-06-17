import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import DescriptionList from './DescriptionList';
import KubernetesStore from '../stores/KubernetesStore';
import PageHeader from './PageHeader';
import RequestErrorMsg from './RequestErrorMsg';
import PoliciesBreadcrumb from './PoliciesBreadcrumb';
import TabsMixin from '../mixins/TabsMixin';

const TABS = {
  details: 'Details'
};

const METHODS_TO_BIND = [
  'onPolicyStoreError',
  'onPolicyStoreSuccess'
];

class PolicyDetail extends mixin(TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = Object.assign({}, TABS);

    this.policy = {};
    this.state = {
      currentTab: 'details',
      directory: null,
      expandClass: 'large',
      showExpandButton: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  // onStateStoreSuccess() {
  //   let task = MesosStateStore.getTaskFromTaskID(this.props.params.taskID);
  //   TaskDirectoryStore.getDirectory(task);
  // }

  onPolicyStoreError() {
    // this.setState({
    //   podDirectoryErrorCount: this.state.podDirectoryErrorCount + 1
    // });
  }

  onPolicyStoreSuccess() {
    // this.setState({
    //   directory: TaskDirectoryStore.get('directory'),
    //   podDirectoryErrorCount: 0
    // });
  }

  hasLoadingError() {
    return false;
  }

  getErrorScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center vertical-center inverse">
        <RequestErrorMsg />
      </div>
    );
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getBasicInfo(policy) {
    if (policy == null) {
      return null;
    }

    let policyIcon = (
      <img src="/kuber.png" />
    );

    const mediaWrapperClassNames = {
      'media-object-spacing-narrow': false,
      'media-object-offset': false
    };

    return (
      <PageHeader
        icon={policyIcon}
        subTitle={policy.metadata.namespace}
        mediaWrapperClassName={mediaWrapperClassNames}
        title={policy.metadata.name} />
    );
  }

  getPolicyDetailsDescriptionList(policy) {
    if (policy == null) {
      return null;
    }

    let headerValueMapping = {
      'Name': policy.metadata.name,
      'Namespace': policy.metadata.namespace,
      'CreationTimestamp': policy.creationTimestamp,
      'Spec': policy.getSpec(),
      'Status': policy.getStatus()
    };

    return (
      <DescriptionList
        className="container container-fluid flush container-pod container-pod-super-short flush-top"
        hash={headerValueMapping}
        headline="Configuration" />
    )
  }

  renderDetailsTabView() {
    let policy = this.policy;

    return (
      <div className="container container-fluid flush">
        {this.getPolicyDetailsDescriptionList(policy)}
      </div>
    );
  }

  getNotFound(item, name, namespace) {
    return (
      <div className="container container-fluid container-pod text-align-center">
        <h3 className="flush-top text-align-center">
          {`Error finding ${item}`}
        </h3>
        <p className="flush">
          {`Did not find a ${item} with name "${name}" and namespace "${namespace}"`}
        </p>
      </div>
    );
  }

  getPoliciesBreadcrumb() {
    let {name, namespace} = this.props.params;

    return (<PoliciesBreadcrumb namespace={namespace} name={name} />);
  }

  render() {

    let name = this.props.params.name;
    let namespace = this.props.params.namespace;
    let pod = KubernetesStore.getPod(name, namespace);
    this.pod = pod;

    if (pod === undefined) {
      return this.getNotFound('Pod', name, namespace);
    }

    if (pod.metadata === undefined) {
      return (
        <div className="container container-fluid container-pod text-align-center
            vertical-center inverse">
          <div className="row">
            <div className="ball-scale">
              <div />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-container-col">
        <div className="container-pod
          container-pod-divider-bottom-align-right
          container-pod-short-top flush-bottom flush-top
          service-detail-header media-object-spacing-wrapper
          media-object-spacing-narrow">
          {this.getPodsBreadcrumb()}
          {this.getBasicInfo(pod)}
          {this.tabs_getTabView()}
        </div>
      </div>
    );
  }
}

PolicyDetail.propTypes = {
  params: React.PropTypes.object
};

module.exports = PolicyDetail;
