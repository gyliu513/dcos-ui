/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

let LogPolicySchema = {
  type: 'object',
  required: [
    'general',
    'spec'
  ],
  properties: {
    'general': {
      title: 'General',
      type: 'object',
      description: 'Define your log policy',
      required: [
        'appName',
        'keyWords',
        'cycle',
        'count',
        'contacter'
      ],
      properties: {
        'appName': {
          title: 'Application Name',
          type: 'string',
          description: 'The application name policy will watch.',
          getter: function (policy) {
            return policy.getAppName();
          }
        },
        'keyWords': {
          title: 'Key Words',
          type: 'string',
          description: 'Key words for log search.',
          getter: function (policy) {
            return policy.getKeywords();
          }
        },
        'cycle': {
          title: 'Cycle',
          type: 'number',
          description: 'The monitor cycle.',
          getter: function (policy) {
            return policy.getCycle();
          }
        },
        'count': {
          title: 'Count',
          type: 'number',
          description: 'If keywords are catched beyond this count number, alert will be triggered.',
          getter: function (policy) {
            return policy.getCount();
          }
        },
        'contacter': {
          title: 'Contacter',
          type: 'string',
          description: 'Urgent contacter when alert is triggered',
          getter: function (policy) {
            return policy.getContacter();
          }
        }
      }
    }
  }
};

module.exports = LogPolicySchema;
