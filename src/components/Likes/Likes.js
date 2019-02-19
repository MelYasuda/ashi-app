import React, { Component } from 'react';
import * as firebase from 'firebase';
import Listing from '../Listings/Listing';

class Likes extends Component {

  constructor(props){
    super(props);
    this.state = {
      likedListings: null,
      isLoading: true
    }
  }

  componentDidMount(){
    const currentUid = firebase.auth().currentUser.uid;

    const getLikesList = () => {
      return new Promise((resolve, reject) => {
        firebase.database().ref(`users/${currentUid}/likes`).on('value', (snapshot)=>{
          const likesList = snapshot.val();
          resolve(likesList)
        })
      })
    }


    const getLikedListings = (likesList) => {
      const promises = [];
      for(const like in likesList){
      promises.push(new Promise((resolve, reject) => {
          const {country, city, category, passengerKey, listingId} = likesList[like];
          let categoryName = '';
          if(category===0){
            categoryName="Roommate";
          } else if (category===1){
            categoryName="Solo Apartments";
          } else {
            categoryName="Shared Apartments"
          }
          firebase.database().ref(`Posts/${country}/${city}/${passengerKey}/${categoryName}/${listingId}`).on('value', (snapshot) => {
            const likedListings = snapshot.val();
            resolve(likedListings)
          } )
      })
      )
    }
    return Promise.all(promises);
    }

    const setLikedListings = (likedListings) => {
      this.setState({
        likedListings: likedListings,
        isLoading: false
      })
      console.log(likedListings)
    }

    getLikesList().then(getLikedListings).then(setLikedListings)
  }

  render(){
    if(this.state.isLoading) return null;
    return (
    <div>
    <h1>Likes</h1>
    {
      this.state.likedListings.map( (likedListing, index)=>(
        <div className='row' style={{paddingLeft: '8%'}}>
          <Listing key={index} value={likedListing} history={this.props.history}/>
        </div>
      ))
    }
    </div>
    )}
}

export default Likes;