import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import FilterInputText from './FilterInputText';
import QueryParamsMixin from '../mixins/QueryParamsMixin';

const METHODS_TO_BIND = ['setSearchString'];

const PolicyFilterTypes = {
  NAMESPACE: 'filterNamespace',
  TEXT: 'searchString'
};

class PolicySearchFilter extends mixin(QueryParamsMixin) {
  constructor() {
    super();

    this.state = {
      searchString: ''
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    this.updateFilterStatus();
  }

  componentWillReceiveProps() {
    this.updateFilterStatus();
  }

  setSearchString(filterValue) {
    this.setQueryParam(PolicyFilterTypes.TEXT, filterValue);
    this.props.handleFilterChange(filterValue, PolicyFilterTypes.TEXT);
  }

  updateFilterStatus() {
    let {state} = this;
    let searchString =
      this.getQueryParamObject()[PolicyFilterTypes.TEXT] || '';

    if (searchString !== state.searchString) {
      this.setState({searchString},
        this.props.handleFilterChange.bind(null, searchString, PolicyFilterTypes.TEXT));
    }
  }

  render() {
    return (
      <FilterInputText
        className="flush-bottom"
        handleFilterChange={this.setSearchString}
        inverseStyle={true}
        placeholder="Search"
        searchString={this.state.searchString} />
    );
  }
};

PolicySearchFilter.propTypes = {
  handleFilterChange: React.PropTypes.func.isRequired
};

module.exports = PolicySearchFilter;
