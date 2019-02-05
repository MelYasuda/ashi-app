import React, { Component } from 'react';
import './CreateListing.css';
import CreateListingIcon from './CreateListingIcon';

class CreateListing extends Component {

  handleCategoryForm = (name) => {
    alert(name);
  }

  render() {
    return (
      <div className="CreateListing">
        <h1>CreateListing</h1>
        <div className="row">
          <CreateListingIcon label='Looking For A Roommate' name={"roommate"} onCategoryForm={this.handleCategoryForm} />
          <CreateListingIcon label='Looking For A Room' name={"room"} onCategoryForm={this.handleCategoryForm} />
          <CreateListingIcon label='Lookng For An Apartment' name={"apartment"} onCategoryForm={this.handleCategoryForm}/>
        </div>
      </div>
    );
  }
}

export default CreateListing;