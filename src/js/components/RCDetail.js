import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import DescriptionList from './DescriptionList';
// import MarathonTaskDetailsList from './MarathonTaskDetailsList';
import MesosStateStore from '../stores/MesosStateStore';
import PageHeader from './PageHeader';
import RequestErrorMsg from './RequestErrorMsg';
import RCsBreadcrumb from './RCsBreadcrumb';
import TaskDebugView from './TaskDebugView';
import TaskDirectoryView from './TaskDirectoryView';
import TaskDirectoryStore from '../stores/TaskDirectoryStore';
import TabsMixin from '../mixins/TabsMixin';

const TABS = {
  details: 'Details',
  files: 'Files',
  debug: 'Logs'
};

// TODO(zhiwei): remove redundant stuff
const METHODS_TO_BIND = [
  'onPodDirectoryStoreError',
  'onPodDirectoryStoreSuccess'
];

class RCDetail extends mixin(TabsMixin) {
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

  getBasicInfo(rc) {
    let name = rc.getName();
    let status = rc.getStatus();
    let image = rc.getImage();

    let rcIcon = (
      <img src={image} />
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
        icon={rcIcon}
        subTitle={status}
        navigationTabs={tabs}
        mediaWrapperClassName={mediaWrapperClassNames}
        title={name} />
    );
  }

  getRCDetailsDescriptionList(rc) {
    let headerValueMapping = {
      'Name': rc.getName(),
      'Namespace': rc.getNamespace(),
      'Name1': rc.getName(),
      'Name2': rc.getName(),
      'Name3': rc.getName(),
      'Namespace1': rc.getNamespace(),
      'Namespace2': rc.getNamespace(),
      'Namespace3': rc.getNamespace(),
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
    let rc = this.props.rc;

    return (
      <div className="container container-fluid flush">
        {this.getRCDetailsDescriptionList(rc)}
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

  getRCsBreadcrumb() {
    let rc = this.props.rc;
    let name = rc.getName();
    let namespace = rc.getNamespace();

    return (<RCsBreadcrumb namespace={namespace} name={name} />);
  }

  render() {
    let rc = this.props.rc;

    if (rc.metadata === undefined) {
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
          {this.getRCsBreadcrumb()}
          {this.getBasicInfo(rc)}
          {this.tabs_getTabView()}
        </div>
      </div>
    );
  }
}

RCDetail.propTypes = {
  params: React.PropTypes.object
};

module.exports = RCDetail;
