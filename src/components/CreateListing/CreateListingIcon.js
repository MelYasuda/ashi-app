import React, { Component } from 'react';
import "./CreateListing.css"

class CreateListingIcon extends Component {


  handleCategoryForm = (name) => {
    this.props.onCategoryForm(name)
  }


  render() {
    const {label, name} = this.props;
    return (
      <div className='col-md-3'>
        <button className="btn btn-success" onClick={() => this.handleCategoryForm(name)} >{label}</button>
      </div>
    );
  }
}

export default CreateListingIcon;