/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

let PolicySchema = {
  type: 'object',
  required: [
    'general',
    'spec'
  ],
  properties: {
    'general': {
      title: 'General',
      type: 'object',
      description: 'Define your policy',
      properties: {
        'name': {
          title: 'Name',
          type: 'string',
          description: 'Name for the policy',
          getter: function (policy) {
            return policy.getName();
          }
        },
        'namespace': {
          title: 'Namespace',
          type: 'string',
          description: 'Choose namespace to create this policy',
          getter: function (policy) {
            return policy.getNamespace();
          }
        }
      }
    },
    'spec': {
      title: 'Specification',
      type: 'object',
      description: 'Specification of the policy',
      required: [
        'scaleTargetRef',
        'maxReplicas'
      ],
      properties: {
        'typeOfscaleTarget': {
          title: 'Type of scale target',
          fieldType: 'select',
          options: [
            'Replication Controller',
            'Deployment',
            'Replica Set'
          ],
          description: 'Type of scale target',
          getter: function (policy) {
            return policy.getTypeOfScaleTarget();
          }
        },
        'nameOfScaleTarget': {
          title: 'Name of scale target',
          type: 'string',
          description: 'Name of scale target',
          getter: function (policy) {
            return policy.getNameOfScaleTarget();
          }
        },
        'minReplicas': {
          title: 'Minimum number of replications',
          type: 'number',
          description: 'Min numer of replications',
          getter: function (policy) {
            return policy.getMinReplicas();
          }
        },
        'maxReplicas': {
          title: 'Maximum number of replications',
          type: 'number',
          description: 'Max number of replications',
          getter: function (policy) {
            return policy.getMaxReplicas();
          }
        },
        'targetCPUUtilizationPercentage': {
          title: 'Target CPU utilization',
          type: 'number',
          description: 'Target CPU utilization',
          getter: function (policy) {
            return policy.getTargetCPUUtilization();
          },
          validate: {function(v) { return v > 0 && v < 100 }}
        }
      }
    },
  }
};

module.exports = PolicySchema;
