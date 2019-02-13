import React from 'react';
import EditRoommateListing from './EditRoommateListing';
import EditApartmentListing from './EditApartmentListing';


function EditListing(props) {
  if(props.categoryId===0){
    return <EditRoommateListing />  
  } else {
    return <EditApartmentListing />
  }
}

export default EditListing;