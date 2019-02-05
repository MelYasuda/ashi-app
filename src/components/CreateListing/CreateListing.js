import React, { Component } from 'react';
import './CreateListing.css';
import CreateListingIcon from './CreateListingIcon';
import RoomListingForm from './RoomListingForm';
import RoommateListingForm from './RoommateListingForm';
import ApartmentListingForm from './ApartmentListingForm';

const CondCreateForm = (props) => {
  const categoryDisplayed = props.categoryDisplayed;
  if(categoryDisplayed==="room"){
    return <RoomListingForm />
  } else if(categoryDisplayed==="roommate"){
    return <RoommateListingForm />
  } else if(categoryDisplayed==="apartment") {
    return <ApartmentListingForm />
  } else {
    console.log(categoryDisplayed)
    return null
  }
}

class CreateListing extends Component {
  constructor(props){
    super(props);
    this.state = {
      categoryDisplayed: null
    }
  }

  handleCategoryForm = (name) => {
    this.setState({categoryDisplayed: name})
  }

  render() {
    if(!this.state.categoryDisplayed){
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
    } else {
      return (
      <CondCreateForm categoryDisplayed={this.state.categoryDisplayed} />
      )
    }
  }
}

export default CreateListing;