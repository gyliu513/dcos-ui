import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import DescriptionList from './DescriptionList';
// import MarathonTaskDetailsList from './MarathonTaskDetailsList';
import PageHeader from './PageHeader';
import RequestErrorMsg from './RequestErrorMsg';
import ResourcesUtil from '../utils/ResourcesUtil';
import PodsBreadcrumb from './PodsBreadcrumb';
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

  onStateStoreSuccess() {
    let task = {};
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
    let name = pod.getName();
    let status = pod.getStatus();
    let image = pod.getImage();

    let podIcon = (
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
        icon={podIcon}
        subTitle={status}
        navigationTabs={tabs}
        mediaWrapperClassName={mediaWrapperClassNames}
        title={name} />
    );
  }

  getPodDetailsDescriptionList(pod) {
    if (pod == null) {
      return null;
    }

    let headerValueMapping = {
      'ID': pod.getUID(),
      'Name': pod.getName(),
      'Namespace': pod.getNamespace(),
      'Node': pod.getHostIP(),
      'IP': pod.getPodIP(),
      'Start Time': pod.getAge(),
      'Status': pod.getStatus(),
      'Image': pod.getContainerImages(),
    };

    return (
      <DescriptionList
        className="container container-fluid flush container-pod container-pod-super-short flush-top"
        hash={headerValueMapping}
        headline="Configuration" />
    )
  }

  renderDetailsTabView() {
    let pod = this.props.pod;

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

  tabs_handleTabClick() {
    this.setState({selectedLogFile: null});

    // Only call super after we are done removing/adding listeners
    super.tabs_handleTabClick(...arguments);
  }

  getPodsBreadcrumb() {
    let pod = this.props.pod;
    let name = pod.getName();
    let namespace = pod.getNamespace()
    return (<PodsBreadcrumb namespace={namespace} name={name} />);
  }

  render() {
    let pod = this.props.pod;

    // loading page
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
