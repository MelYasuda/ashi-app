import React from 'react';
import EditRoommateListing from './EditRoommateListing';
import EditApartmentListing from './EditApartmentListing';


function EditListing(props) {
  const queryObject = {}
  const query = props.history.location.search.split('?');
  query.map(part => {
    const pair = part.split('=');
    const key = pair[0];
    const value = decodeURI(pair[1]);
    queryObject[key] = value
  })

  const categoryId = parseInt(queryObject.category);

  console.log(props)
  if(categoryId===0){
    return <EditRoommateListing {...props}/>  
  } else {
    return <EditApartmentListing {...props}/>
  }
}

export default EditListing;