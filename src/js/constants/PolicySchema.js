/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

let PolicySchema = {
  type: 'object',
  required: [
    'name',
    'namespace',
    'spec'
  ],
  properties: {
    'name': {
      title: 'Name',
      type: 'string',
      description: 'Set name for the policy'
    },
    'namespace': {
      title: 'Namespace',
      type: 'string',
      description: 'Choose namespace to create this policy'
    },
    'spec': {
      type: 'object',
      description: 'Specification of the policy',
      required: [
        'scaleTargetRef',
        'minReplicas',
        'maxReplicas',
        'cpuUtilization'
      ],
      properties: {
        'scaleTargetRef': {
          type: 'object',
          required: [
            'kind',
            'name'
          ],
          properties: {
            'kind': {
              title: 'Kind',
              fieldType: 'select',
              options: [
                'ReplicationController',
                'Deployment'
              ],
            },
            'name': {
              title: 'Name',
              type: 'string',
              description: 'Name of the target scale resource'
            }
          }
        },
        'minReplicas': {
          title: 'MinReplicas',
          type: 'number'
        },
        'maxReplicas': {
          title: 'MaxReplicas',
          type: 'number'
        },
        'cpuUtilization': {
          type: 'object',
          required: [
            'targetPercentage'
          ],
          properties: {
            'targetPercentage': {
              title: 'TargetPercentage',
              type: 'number',
              validate: {function(v) { return v > 0 && v < 100 }}
            }
          }
        }
      }
    },
  }
};

module.exports = PolicySchema;
