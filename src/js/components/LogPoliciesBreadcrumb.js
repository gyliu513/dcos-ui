import React from 'react';
import {Link} from 'react-router';

class LogPoliciesBreadcrumb extends React.Component {
  constructor() {
    super();
  }

  render() {
    const {name} = this.props;
    const breadcrumbIcon = (
      <i className="icon
        icon-sprite
        icon-sprite-small
        icon-sprite-small-white
        icon-back
        forward" />
    );

    let breadcrumbNodes = [(
      <span className="crumb" key="/">
        <Link to="policies-app-policy">Policies</Link>
      </span>
    )];

    if (name != null) {
      breadcrumbNodes.push(
        <span className="crumb" key={name}>
          {breadcrumbIcon}
          <span>{name}</span>
        </span>
      );
    }

    return (
      <div className="flex-box control-group">
        <h4 className="breadcrumbs flush-top inverse">
          {breadcrumbNodes}
        </h4>
      </div>
    );
  }
}

module.exports = LogPoliciesBreadcrumb;
