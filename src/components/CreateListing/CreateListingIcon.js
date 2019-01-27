import React, { Component } from 'react';

class CreateListingIcon extends Component {
  render() {
    const {label} = this.props;
    return (
        <button className="btn btn-success">{label}</button>
    );
  }
}

export default CreateListingIcon;