import React from 'react';
import * as firebase from 'firebase';


const CondModalButtons = (props) => {
  const queryUid = props.history.location.search.split('=')[1];
  const currentUid = firebase.auth().currentUser.uid;
  const {listingId, country,city, passengerKey, category} = props.details;


  const routeToEditPage = () => {

    props.history.push({
      pathname: 'listings/edit',
      search: '?country=' + country + '?city=' + city + '?id=' + passengerKey + '?category=' + category + '?listingId=' + listingId
    });
  }

    const handleDelete = () => {
      let categoryName = '';
      if(category===0){
        categoryName = 'Roommate'
      } else if (category===1){
        categoryName = 'Solo Apartments';
      } else {
        categoryName = 'Shared Apartments'
      }

        const ref = firebase.database().ref(`Posts/${country}/${city}/${passengerKey}/${categoryName}/${listingId}/`);
        ref.remove()
        .then(
          props.history.push({
            pathname: '/',
            search: '?id=' + currentUid
          })
        )
    }

    const handleSave = () => {
      const previousLikes = null;

      const {listingKey, passengerKey, category, city, country} = props.details;

      const ref = firebase.database().ref(`users/${currentUid}/saved`);
      const newChildRef = ref.push();
      newChildRef.set({listingId: listingKey, passengerKey: passengerKey, country: country, city: city, category: category})

    }

    const renderAfterUnsave = () => {
      props.renderAfterUnsave()
    }

    const handleUnsave = () => {
      const listingKey = props.details.listingKey;
      console.log(listingKey)
      const ref = firebase.database().ref(`users/${currentUid}`);
      ref.child('saved').orderByChild('listingId').equalTo(listingKey).once("value").then(function(snapshot) {
        snapshot.forEach(function(child) {
          child.ref.remove();
        })
        renderAfterUnsave()
      });
      
    }



  if(queryUid===currentUid){
    return (
      <div>
        <button className="btn btn-primary" onClick={()=>routeToEditPage()}>Edit</button>
        <button className="btn btn-danger" onClick={()=>handleDelete()}>Delete</button>
      </div>
    )
  } else {
    if(!props.saved){
    return <button className='btn btn-primary' onClick={()=>handleSave()}>Save</button>}
    else {
      return <button className='btn btn-danger'onClick={() => handleUnsave()}>Unsave</button>
    }
  }
}

export default CondModalButtons;