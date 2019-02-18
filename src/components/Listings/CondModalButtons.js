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


    const handleLike = () => {
      const previousLikes = null;
      // firebase.database().ref(`users/${currentUid}/likes`).on('value', (snapshot) => {
      //   let likesValue = snapshot.val();
      //   alert(likesValue)
      // })

      const {listingKey, passengerKey, category, city, country} = props.details;

      const ref = firebase.database().ref(`users/${currentUid}/likes`);
      const newChildRef = ref.push();
      newChildRef.set({listingId: listingKey, passengerKey: passengerKey, country: country, city: city, category: category})
    }



  if(queryUid===currentUid){
    return (
      <div>
        <button className="btn btn-primary" onClick={()=>routeToEditPage()}>Edit</button>
        <button className="btn btn-danger" onClick={()=>handleDelete()}>Delete</button>
      </div>
    )
  } else {
    return <button className='btn btn-primary' onClick={()=>handleLike()}>Like</button>
  }
}

export default CondModalButtons;