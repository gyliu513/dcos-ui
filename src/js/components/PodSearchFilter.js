import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import FilterInputText from './FilterInputText';
import QueryParamsMixin from '../mixins/QueryParamsMixin';
import PodFilterTypes from '../constants/PodFilterTypes';

const METHODS_TO_BIND = ['setSearchString'];

class PodSearchFilter extends mixin(QueryParamsMixin) {
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
    this.setQueryParam(PodFilterTypes.TEXT, filterValue);
    this.props.handleFilterChange(filterValue, PodFilterTypes.TEXT);
  }

  updateFilterStatus() {
    let {state} = this;
    let searchString =
      this.getQueryParamObject()[PodFilterTypes.TEXT] || '';

    if (searchString !== state.searchString) {
      this.setState({searchString},
        this.props.handleFilterChange.bind(null, searchString, PodFilterTypes.TEXT));
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

PodSearchFilter.propTypes = {
  handleFilterChange: React.PropTypes.func.isRequired
};

module.exports = PodSearchFilter;
