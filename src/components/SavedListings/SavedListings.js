import React, { Component } from 'react';
import * as firebase from 'firebase';
import Listing from '../Listings/Listing';

const SavedListingsDisplay = (props) => {
  console.log(props.savedListings)
    if(props.savedListings.length){
      return(
        <div className='row' style={{paddingLeft: '8%'}}>
          {
            props.savedListings.map( (likedListing, index)=>(
                <Listing 
                renderAfterUnsave={props.renderAfterUnsave} 
                key={index} 
                value={likedListing} 
                saved={props.saved} 
                history={props.history}
                handdleToggleSaveButton={props.handdleToggleSaveButton}
                />
            ))
          }
        </div>
      )
    } else {
      return <h3>You haven't saved any listings yet.</h3>
    }
}

class SavedListings extends Component {

  constructor(props){
    super(props);
    this.state = {
      savedListings: null,
      isLoading: true,
      saved: true
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
    console.log(promises)
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
    <h1>Saved Listings</h1>
    <SavedListingsDisplay
      savedListings={this.state.savedListings}
      renderAfterUnsave={this.renderAfterUnsave}  
      saved={this.state.saved} 
      history={this.props.history}
      handdleToggleSaveButton={this.handdleToggleSaveButton}
      />
    



    </div>
    )}
}

export default SavedListings;