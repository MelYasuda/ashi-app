import React from 'react';
import EditRoommateListing from './EditRoommateListing';
import EditApartmentListing from './EditApartmentListing';


function EditListing(props) {
  if(props.categoryId===0){
    return <EditRoommateListing {...props}/>  
  } else {
    return <EditApartmentListing {...props}/>
  }
}

export default EditListing;