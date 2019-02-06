import React, { Component } from 'react';
import TextForm from "../TextForm/TextForm"
import AutoCompleteForm from "../TextForm/AutoCompleteForm"

class ApartmentListingForm extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  backToCreateSelection = (value) => {
    this.props.onCategoryForm(value)
  }

  handleGoBack = () => {
    this.props.history.push("/")
  }

  render(){
    return(
      <div>
        <h1>Apartment Listing</h1>
        <AutoCompleteForm />
        <TextForm />
        <TextForm />
        <TextForm />
        <TextForm />
        <button onClick={this.handleGoBack}>Back</button>
        <button onClick={()=>this.backToCreateSelection(null)}>Categories</button>
      </div>
    );
  }
}

export default ApartmentListingForm;