import React, { Component } from 'react';
import * as firebase from 'firebase';
import Listing from '../Listings/Listing';

class SavedListings extends Component {

  constructor(props){
    super(props);
    this.state = {
      savedListings: null,
      isLoading: true,
      notSaved: true
    }
  }

  componentDidMount(){
    const currentUid = firebase.auth().currentUser.uid;

    const getLikesList = () => {
      return new Promise((resolve, reject) => {
        firebase.database().ref(`users/${currentUid}/saved`).on('value', (snapshot)=>{
          const savedListings = snapshot.val();
          resolve(savedListings)
        })
      })
    }


    const getSavedListings = (savedListings) => {
      const promises = [];
      for(const savedLising in savedListings){
      promises.push(new Promise((resolve, reject) => {
          const {country, city, category, passengerKey, listingId} = savedListings[savedLising];
          let categoryName = '';
          if(category===0){
            categoryName="Roommate";
          } else if (category===1){
            categoryName="Solo Apartments";
          } else {
            categoryName="Shared Apartments"
          }
          firebase.database().ref(`Posts/${country}/${city}/${passengerKey}/${categoryName}/${listingId}`).on('value', (snapshot) => {
            const savedListings = snapshot.val();
            savedListings['listingKey'] = listingId;
            resolve(savedListings)
          } )
      })
      )
    }
    return Promise.all(promises);
    }

    const setSavedListings = (savedListings) => {
      this.setState({
        savedListings: savedListings,
        isLoading: false
      })
    }

    getLikesList().then(getSavedListings).then(setSavedListings)
  }

  renderAfterUnsave = () => {
    this.componentDidMount()
    }

  render(){
    console.log(this.state.isLoading)
    if(this.state.isLoading) return null;
    return (
    <div className='container'>
    <h1>SavedListings</h1>
      <div className='row' style={{paddingLeft: '8%'}}>
        {
          this.state.savedListings.map( (likedListing, index)=>(
              <Listing 
              renderAfterUnsave={this.renderAfterUnsave} 
              key={index} 
              value={likedListing} 
              saved={this.state.notSaved} 
              history={this.props.history}
              handdleToggleSaveButton={this.handdleToggleSaveButton}
              />
          ))
        }
      </div>

    </div>
    )}
}

export default SavedListings;