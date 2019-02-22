import React, { Component } from 'react';
import "./CreateListing.css";
import roommate from '../../assets/img/roommate.jpeg';
import room from '../../assets/img/room.jpeg';
import apartment from '../../assets/img/apartment.jpeg';

let iconImage = null;

class CreateListingIcon extends Component {
  constructor(props){
    super(props);
    this.state = {}

  }

  handleCategoryForm = (name) => {
    this.props.onCategoryForm(name)
  }

  render() {
    const {label, name} = this.props;
    if(name==='room'){
      iconImage = room
    } else if(name==='roommate'){
      iconImage = roommate
    } else if(name==='apartment'){
      iconImage = apartment      
    }
    return (
      <div className='col-md-3'>
        <div style={{
          backgroundImage: 'url(' + iconImage + ')',
          backgroundPosition: 'center',
          }} className="icon-button" onClick={() => this.handleCategoryForm(name)} >{label}</div>
      </div>
    );
  }
}


export default CreateListingIcon;

