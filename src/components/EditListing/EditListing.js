import React from 'react';
import EditRoommateListing from './EditRoommateListing';
import EditApartmentListing from './EditApartmentListing';


function EditListing(props) {
  console.log(props.details)
  if(props.categoryId===0){
    return <EditRoommateListing details={props.details}/>  
  } else {
    return <EditApartmentListing details={props.details}/>
  }
}

export default EditListing;