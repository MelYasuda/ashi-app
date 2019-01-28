import React, { Component } from 'react';
import "./CreateListing.css"

class CreateListingIcon extends Component {
  render() {
    const {label} = this.props;
    return (
      <div className='col-md-3'>
        <button className="btn btn-success">{label}</button>
      </div>
    );
  }
}

export default CreateListingIcon;