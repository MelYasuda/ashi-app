import React, { Component } from 'react';
import './CreateListing.css';
import CreateListingIcon from './CreateListingIcon';

class CreateListing extends Component {
  render() {
    return (
      <div className="CreateListing">
        <h1>CreateListing</h1>
        <div className="row">
          <CreateListingIcon label='Looking For A Roommate' />
          <CreateListingIcon label='Looking For A Room' />
          <CreateListingIcon label='Lookng For One Person Apartment' />
        </div>
      </div>
    );
  }
}

export default CreateListing;