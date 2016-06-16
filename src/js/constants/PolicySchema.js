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
      required: [
        'name',
        'namespace'
      ],
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
        },
        'email': {
          title: 'Email Notification',
          type: 'string',
          description: 'Send Email notification when scale is triggered'
        }
      }
    },
    'spec': {
      title: 'Specification',
      type: 'object',
      description: 'Specification of the policy',
      required: [
        'scaleTargetRef',
        'minReplicas',
        'maxReplicas',
        'targetCPUUtilizationPercentage'
      ],
      properties: {
        'typeOfscaleTarget': {
          title: 'Type of scale target',
          fieldType: 'select',
          options: [
            'ReplicationController',
            'Deployment'
          ],
          description: 'Type of scale target',
          getter: function (policy) {
            let spec = policy.getSpec();

            if (spec.scaleTargetRef && spec.scaleTargetRef.kind) {
              return spec.scaleTargetRef.kind;
            }
            return null;
          }
        },
        'nameOfScaleTarget': {
          title: 'Name of scale target',
          type: 'string',
          description: 'Name of scale target',
          getter: function (policy) {
            let spec = policy.getSpec();

            if (spec.scaleTargetRef && spec.scaleTargetRef.name) {
              return spec.scaleTargetRef.name;
            }
            return null;
          }
        },
        'minReplicas': {
          title: 'Minimum number of replications',
          type: 'number',
          description: 'Min numer of replications',
          getter: function (policy) {
            let spec = policy.getSpec();

            if (spec.minReplicas) {
              return spec.minReplicas;
            }
            return null;
          }
        },
        'maxReplicas': {
          title: 'Maximum number of replications',
          type: 'number',
          description: 'Max number of replications',
          getter: function (policy) {
            let spec = policy.getSpec();

            if (spec.maxReplicas) {
              return spec.maxReplicas;
            }
            return null;
          }
        },
        'targetCPUUtilizationPercentage': {
          title: 'Target CPU utilization',
          type: 'number',
          description: 'Target CPU utilization',
          getter: function (policy) {
            let spec = policy.getSpec();

            if (spec.cpuUtilization && spec.cpuUtilization.targetPercentage) {
              return spec.cpuUtilization.targetPercentage;
            }
            return null;
          },
          validate: {function(v) { return v > 0 && v < 100 }}
        }
      }
    },
  }
};

module.exports = PolicySchema;
