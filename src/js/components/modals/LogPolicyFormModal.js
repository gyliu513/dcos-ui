import Ace from 'react-ace';
import mixin from 'reactjs-mixin';
import {Modal} from 'reactjs-components';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

import KubernetesStore from '../../stores/KubernetesStore';
import SchemaForm from '../SchemaForm';
import LogPolicy from '../../structs/LogPolicy';
import LogPolicyUtil from '../../utils/LogPolicyUtil';
import LogPolicySchema from '../../constants/LogPolicySchema';
import ToggleButton from '../ToggleButton';

const METHODS_TO_BIND = [
  'getTriggerSubmit',
  'handleCancel',
  'handleClearError',
  'handleJSONChange',
  'handleJSONToggle',
  'handleSubmit',
  'onKubernetesStoreLogPolicyCreateError',
  'onKubernetesStoreLogPolicyCreateSuccess'
];

class LogPolicyFormModal extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    let model =
      LogPolicyUtil.createFormModelFromSchema(LogPolicySchema);
    this.state = {
      errorMessage: null,
      jsonDefinition: JSON.stringify({kind: 'LogPolicy',
                                      metadata: {},
                                      spec: {}
                                    },
                                    null, 2),
      jsonMode: true,
      model,
      policy: LogPolicyUtil.createLogPolicyFromFormModel(model)
    };

    this.store_listeners = [
      {
        name: 'policy',
        events: ['policyCreateError', 'policyCreateSuccess']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(...arguments);
    if (!this.props.open && nextProps.open) {
      this.resetState();
    }
  }

  resetState() {
    let model = LogPolicyUtil.createFormModelFromSchema(LogPolicySchema);
    this.setState({
      errorMessage: null,
      jsonDefinition: JSON.stringify({id:'', cmd:''}, null, 2),
      jsonMode: false,
      model,
      policy: LogPolicyUtil.createLogPolicyFromFormModel(model)
    });
  }

  handleClearError() {
    this.setState({
      errorMessage: null
    });
  }

  handleJSONChange(jsonDefinition) {
    let policy = Object.assign({}, this.state.policy);
    try {
      policy = new LogPolicy(JSON.parse(jsonDefinition));
    } catch (e) {

    }
    this.setState({jsonDefinition, policy})
  }

  handleJSONToggle() {
    let nextState = {};
    if (!this.state.jsonMode) {
      let {model} = this.triggerSubmit();
      let policy = LogPolicyUtil.createLogPolicyFromFormModel(model);
      nextState.model = model;
      nextState.policy = policy;
      nextState.jsonDefinition = JSON.stringify(LogPolicyUtil
        .getLogPolicyDefinitionFromLogPolicy(policy), null, 2);
    }
    nextState.jsonMode = !this.state.jsonMode;
    this.setState(nextState);
  }

  onKubernetesStoreLogPolicyCreateSuccess() {
    this.resetState();
    this.props.onClose();
  }

  onKubernetesStoreLogPolicyCreateError(errorMessage) {
    this.setState({
      errorMessage
    });
  }

  handleCancel() {
    this.props.onClose();
  }

  handleSubmit() {
    if (this.state.jsonMode) {
      let jsonDefinition = this.state.jsonDefinition;
      KubernetesStore.createLogPolicy(JSON.parse(jsonDefinition));
      this.setState({
        errorMessage: null,
        jsonDefinition,
        policy: new LogPolicy(JSON.parse(jsonDefinition))
      });
      return;
    }
    if (this.triggerSubmit) {
      let {model} = this.triggerSubmit();
      let policy = LogPolicyUtil.createLogPolicyFromFormModel(model);
      this.setState({policy, model, errorMessage: null});
      KubernetesStore
        .createLogPolicy(LogPolicyUtil.getLogPolicyDefinitionFromLogPolicy(policy));
    }
  }

  getTriggerSubmit(triggerSubmit) {
    this.triggerSubmit = triggerSubmit;
  }

  getErrorMessage() {
    let {errorMessage} = this.state;
    if (!errorMessage) {
      return null;
    }

    return (
      <div>
        <h4 className="text-align-center text-danger flush-top">
          {errorMessage.message}
        </h4>
        <pre className="text-danger">
          {JSON.stringify(errorMessage.details, null, 2)}
        </pre>
        <button
          className="button button-small button-danger flush-bottom"
          onClick={this.handleClearError}>
          clear
        </button>
      </div>
    );
  }

  getFooter() {
    return (
      <div className="button-collection flush-bottom">
        <button
          className="button button-large flush-top flush-bottom"
          onClick={this.handleCancel}>
          Cancel
        </button>
        <ToggleButton
          checked={this.state.jsonMode}
          onChange={this.handleJSONToggle}>
          JSON mode
        </ToggleButton>
        <button
          className="button button-large button-success flush-bottom"
          onClick={this.handleSubmit}>
          Define
        </button>
      </div>
    );
  }

  getModalContents() {
    let {jsonDefinition, jsonMode, policy} = this.state;
    if (jsonMode) {
      return (
        <Ace editorProps={{$blockScrolling: true}}
          mode="json"
          onChange={this.handleJSONChange}
          showGutter={true}
          showPrintMargin={false}
          theme="monokai"
          value={jsonDefinition}
          width="100%"/>
      );
    }

    return (
      <SchemaForm
        getTriggerSubmit={this.getTriggerSubmit}
        model={LogPolicyUtil.createFormModelFromSchema(LogPolicySchema, policy)}
        schema={LogPolicySchema}/>
    );
  }

  render() {
    return (
      <Modal
        backdropClass="modal-backdrop default-cursor"
        maxHeightPercentage={.9}
        bodyClass=""
        modalWrapperClass="multiple-form-modal"
        innerBodyClass=""
        open={this.props.open}
        showCloseButton={false}
        showHeader={true}
        footer={this.getFooter()}
        titleText="Define New Log Policy"
        showFooter={true}>
        {this.getErrorMessage()}
        {this.getModalContents()}
      </Modal>
    );
  }
}

LogPolicyFormModal.defaultProps = {
  onClose: function () {},
  open: false
};

LogPolicyFormModal.propTypes = {
  open: React.PropTypes.bool,
  model: React.PropTypes.object,
  onClose: React.PropTypes.func
};

module.exports = LogPolicyFormModal;
