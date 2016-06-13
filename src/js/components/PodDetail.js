import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import DescriptionList from './DescriptionList';
// import MarathonTaskDetailsList from './MarathonTaskDetailsList';
import MesosStateStore from '../stores/MesosStateStore';
import KubernetesStore from '../stores/KubernetesStore';
import PageHeader from './PageHeader';
import RequestErrorMsg from './RequestErrorMsg';
import ResourcesUtil from '../utils/ResourcesUtil';
import PodsBreadcrumb from './PodsBreadcrumb';
import TaskDebugView from './TaskDebugView';
import TaskDirectoryView from './TaskDirectoryView';
import TaskDirectoryStore from '../stores/TaskDirectoryStore';
import Units from '../utils/Units';
import TabsMixin from '../mixins/TabsMixin';

const TABS = {
  details: 'Details',
  files: 'Files',
  debug: 'Logs'
};

const METHODS_TO_BIND = [
  'onPodDirectoryStoreError',
  'onPodDirectoryStoreSuccess'
];

class PodDetail extends mixin(TabsMixin) {
  constructor() {
    super(...arguments);

    this.tabs_tabs = Object.assign({}, TABS);

    this.pod = {};
    this.state = {
      currentTab: 'details',
      directory: null,
      expandClass: 'large',
      showExpandButton: false,
      selectedLogFile: null,
      podDirectoryErrorCount: 0
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  // componentDidMount() {
  //   super.componentDidMount(...arguments);
  //   this.store_removeEventListenerForStoreID('summary', 'success');
  // }

  onStateStoreSuccess() {
    let task = MesosStateStore.getTaskFromTaskID(this.props.params.taskID);
    TaskDirectoryStore.getDirectory(task);
  }

  onPodDirectoryStoreError() {
    this.setState({
      podDirectoryErrorCount: this.state.podDirectoryErrorCount + 1
    });
  }

  onPodDirectoryStoreSuccess() {
    this.setState({
      directory: TaskDirectoryStore.get('directory'),
      podDirectoryErrorCount: 0
    });
  }

  hasLoadingError() {
    return this.state.podDirectoryErrorCount >= 3;
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

  handleOpenLogClick(selectedLogFile) {
    this.setState({selectedLogFile, currentTab: 'debug'});
  }

  getResources(pod) {
    if (pod.spec.containers[0].resources.limits == null) {
      return null;
    }

    let resourceColors = ResourcesUtil.getResourceColors();
    let resourceLabels = ResourcesUtil.getResourceLabels();

    return ResourcesUtil.getDefaultResources().map(function (resource) {
      if (resource === 'ports' || resource === 'disk') {
        return null;
      }

      let colorIndex = resourceColors[resource];
      let resourceLabel = resourceLabels[resource];
      let resourceIconClasses = `icon icon-sprite icon-sprite-medium
        icon-sprite-medium-color icon-resources-${resourceLabel.toLowerCase()}`;
      // remove this setting
      let resourceValue = Units.formatResource(
        resource, pod.spec.containers[0].resources.limits[resource]
      );
      return (
        <div key={resource} className="media-object-item">
          <div className="media-object-spacing-wrapper media-object-spacing-narrow media-object-offset">
            <div className="media-object media-object-align-middle">
              <div className="media-object-item">
                <i className={resourceIconClasses}></i>
              </div>
              <div className="media-object-item">
                <h4 className="flush-top flush-bottom inverse">
                  {resourceValue}
                </h4>
                <span className={`side-panel-resource-label
                    text-color-${colorIndex}`}>
                  {resourceLabel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  getBasicInfo(pod) {
    if (pod == null) {
      return null;
    }

    let podIcon = (
      <img src="/kuber.png" />
    );

    let tabs = (
      <ul className="tabs list-inline flush-bottom container-pod
        container-pod-short-top inverse">
        {this.tabs_getUnroutedTabs()}
      </ul>
    );

    const mediaWrapperClassNames = {
      'media-object-spacing-narrow': false,
      'media-object-offset': false
    };

    return (
      <PageHeader
        icon={podIcon}
        subTitle={pod.status.phase}
        navigationTabs={tabs}
        mediaWrapperClassName={mediaWrapperClassNames}
        title={pod.metadata.name} />
    );
  }

  getPodDetailsDescriptionList(pod) {
    if (pod == null) {
      return null;
    }

    let headerValueMapping = {
      'ID': pod.metadata.uid,
      'Name': pod.metadata.name,
      'Namespace': pod.metadata.namespace,
      'Node': pod.status.hostIP,
      'IP': pod.status.podIP,
      'Start Time': pod.status.startTime,
      'Status': pod.status.phase,
      'Image': pod.status.containerStatuses[0].image,
    };

    return (
      <DescriptionList
        className="container container-fluid flush container-pod container-pod-super-short flush-top"
        hash={headerValueMapping}
        headline="Configuration" />
    )
  }

  getMesosTaskLabelDescriptionList(mesosTask) {
    if (mesosTask == null) {
      return null;
    }

    let labelMapping = {};

    if (mesosTask.labels) {
      mesosTask.labels.forEach(function (label) {
        labelMapping[label.key] = label.value;
      });
    }

    return (
      <DescriptionList
        className="container container-fluid flush container-pod container-pod-super-short flush-top"
        hash={labelMapping}
        headline="Labels" />
    );
  }

  renderDetailsTabView() {
    let pod = this.pod;

    return (
      <div className="container container-fluid flush">
        <div className="media-object-spacing-wrapper container-pod container-pod-super-short flush-top flush-bottom">
          <div className="media-object">
            {this.getResources(pod)}
          </div>
        </div>
        {this.getPodDetailsDescriptionList(pod)}
      </div>
    );
  }

  renderFilesTabView() {
    let pod = this.pod;
    let state = this.state;
    if (this.hasLoadingError()) {
      this.getErrorScreen();
    }
    if (!state.directory || !pod) {
      return this.getLoadingScreen();
    }

    return (
      <TaskDirectoryView
        directory={state.directory}
        task={pod}
        onOpenLogClick={this.handleOpenLogClick.bind(this)} />
    );
  }

  renderLogsTabView() {
    let {state, pod} = this;

    if (this.hasLoadingError()) {
      this.getErrorScreen();
    }

    if (!state.directory || !pod) {
      return this.getLoadingScreen();
    }

    return (
      <TaskDebugView
        logViewClassName="inverse"
        selectedLogFile={state.selectedLogFile}
        showExpandButton={this.showExpandButton}
        directory={state.directory}
        task={pod} />
    );
  }

  tabs_handleTabClick() {
    this.setState({selectedLogFile: null});

    // Only call super after we are done removing/adding listeners
    super.tabs_handleTabClick(...arguments);
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

  getPodsBreadcrumb() {
    let {name, namespace} = this.props.params;

    // if (name == null) {
    //   return null;
    // }

    return (<PodsBreadcrumb namespace={namespace} name={name} />);
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

PodDetail.propTypes = {
  params: React.PropTypes.object
};

module.exports = PodDetail;
