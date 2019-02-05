import React, { Component } from 'react';
import TextForm from "../TextForm/TextForm"

class RoommateListingForm extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  handleGoBack = () => {
    this.props.history.push("/")
  }

  backToCreateSelection = (value) => {
    this.props.onCategoryForm(value)
  }

  render(){
    return(
      <div>
        <h1>Roommate Listing</h1>
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

export default RoommateListingForm;