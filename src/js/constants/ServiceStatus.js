import ServiceStatusLabels from './ServiceStatusLabels';
import ServiceStatusTypes from './ServiceStatusTypes';

var POD_STATUS = {
  RUNNING: {
    key: ServiceStatusTypes.RUNNING,
    displayName: ServiceStatusLabels.RUNNING
  },
  DEPLOYING: {
    key: ServiceStatusTypes.DEPLOYING,
    displayName: ServiceStatusLabels.DEPLOYING
  },
  SUSPENDED: {
    key: ServiceStatusTypes.SUSPENDED,
    displayName: ServiceStatusLabels.SUSPENDED
  },
  NA: {
    key: ServiceStatusTypes.NA,
    displayName: ServiceStatusLabels.NA
  }
};

module.exports = POD_STATUS;
