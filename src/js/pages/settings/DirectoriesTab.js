import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLDirectoriesStore from '../../stores/ACLDirectoriesStore';
import FormModal from '../../components/FormModal';

const buttonDefinition = [
  {
    text: 'Close',
    className: 'button button-medium',
    isClose: true
  },
  {
    text: 'Add',
    className: 'button button-success button-medium',
    isSubmit: true
  }
];

const METHODS_TO_BIND = [
  'changeModalOpenState',
  'handleModalSubmit'
];

class DirectoriesTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      modalOpen: false
    };

    this.store_listeners = [
      {
        name: 'aclDirectories',
        events: ['fetchSuccess']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    ACLDirectoriesStore.fetchDirectories();
  }

  onAclDirectoriesStoreFetchSuccess() {

  }

  handleModalSubmit() {
    this.changeModalOpenState(false);
  }

  changeModalOpenState(open) {
    this.setState({modalOpen: open});
  }

  getModalFormDefinition() {
    return [
      {
        fieldType: 'text',
        name: 'host',
        placeholder: 'Host',
        required: true,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'text',
        name: 'port',
        placeholder: 'Port',
        required: true,
        validationErrorText: 'Value should be numerical',
        showLabel: false,
        writeType: 'input',
        validation: /^[0-9]+$/,
        value: ''
      },
      {
        fieldType: 'text',
        name: 'dntemplate',
        placeholder: 'Distinguished Name template',
        required: true,
        validationErrorText:
          'Value must contain username placeholder "%(username)s"',
        showLabel: false,
        writeType: 'input',
        validation: /\%\(username\)s/,
        value: ''
      },
      {
        fieldType: 'checkbox',
        name: 'use-ldaps',
        required: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: [
          {
            name: 'use-ldaps',
            label: 'Use SSL/TLS socket'
          }
        ]
      },
      {
        fieldType: 'checkbox',
        name: 'enforce-starttls',
        required: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: [
          {
            name: 'enforce-starttls-checkbox',
            label: 'Enforce StartTLS when SSL/TLS is not set'
          }
        ]
      }
    ];
  }

  renderDirectory() {
    return (
      <div>I'm a directory</div>
    );
  }

  renderAddDirectory() {
    return (
      <div>
        <button
          className="button button-success"
          onClick={this.changeModalOpenState.bind(null, true)}>
          + Add Directory
        </button>
        <FormModal
          buttonDefinition={buttonDefinition}
          definition={this.getModalFormDefinition()}
          disabled={false}
          onClose={this.changeModalOpenState.bind(null, false)}
          onSubmit={this.handleModalSubmit}
          open={this.state.modalOpen}>
          <h2 className="modal-header-title text-align-center flush-top">
            Add External Directory
          </h2>
        </FormModal>
      </div>
    );
  }

  render() {
    let directories = ACLDirectoriesStore.get('directories');
    if (directories) {
      return this.renderDirectory(directories[0]);
    } else {
      return this.renderAddDirectory();
    }
  }
}

module.exports = DirectoriesTab;
