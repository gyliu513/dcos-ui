import React from 'react';
import {Link} from 'react-router';

class PVsBreadcrumb extends React.Component {
  constructor() {
    super();
  }

  render() {
    // const pvItemTree = this.props.pvTreeItem;
    // const breadcrumbIcon = (
    //   <i className="icon
    //     icon-sprite
    //     icon-sprite-small
    //     icon-sprite-small-white
    //     icon-back
    //     forward" />
    // );

    let breadcrumbNodes = [(
      <span className="crumb" key="/">
        <Link to="storage-pvs">PV</Link>
      </span>
    )];

    return (
      <div className="flex-box control-group">
        <h4 className="breadcrumbs flush-top inverse">
          {breadcrumbNodes}
        </h4>
      </div>
    );
  }
}

module.exports = PVsBreadcrumb;
