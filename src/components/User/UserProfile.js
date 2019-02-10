import React, { Component } from 'react';
import * as firebase from 'firebase';
import Listing from '../Listings/Listing';

class UserProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      user: null,
      userListings: null
    }

    const selectedUid = this.props.location.search.split('=')[1]

    const getUser = () => {
      return new Promise((resolve, reject) => {
        const uid = selectedUid;
        firebase.database().ref('users/' + uid).on('value', (snapshot) => {
          var value = snapshot.val();
          value['uid']=uid;
          const objectContainer = {};
          objectContainer['userDetails'] = value;
          resolve(objectContainer)
        })
      })
    }

    const getUserListings = (objectContainer) => {
      const user = objectContainer.userDetails;
      return new Promise((resolve, reject) => {
        firebase.database().ref("Posts/").on('value', (snapshot) => {
          const value = snapshot.val();
          const userListings = [];
          for(const countryKey in value){
            const country = value[countryKey];
            for(const cityKey in country) {
              const city = country[cityKey];
              for(const uid in city){
                if(uid===user.uid){
                userListings.push(city[uid])
                }
              }
            }
          }
          const listingDetails = [];
          userListings.forEach((listings) => {
            Object.keys(listings).map(key=> {
              const listing = listings[key];
             Object.keys(listing).map(key => {
                const details = listing[key];
                listingDetails.push(details);
              })
            })
          })
          console.log(listingDetails)
          objectContainer['userListings']=listingDetails;
          resolve(objectContainer)
        })
      })
    }

    const setUser = (objectContainer) => {
      const userDetails = objectContainer.userDetails;
      const userListings = objectContainer.userListings;
      this.setState({
        user: userDetails,
        userListings: userListings
      });
      this.setState({isLoading: false})
    }

    getUser().then(getUserListings).then(setUser);


  }

  render(){
    if(this.state.isLoading) return null;
    const {Bio, profileImageUrl, username, uid} = this.state.user;
    const userListings=this.state.userListings
    return(
      <div className='container'>
        <h1>user profile</h1>
        <ul>
          <li>{username}</li>
          <li>{Bio}</li>
          <img src={profileImageUrl} alt='profile'  />

        </ul>
        <div className='row' style={{paddingLeft: '8%'}}>
            {
            userListings.map((userListing)=>(
            <Listing value={userListing}/>            
            ))
          }
        </div>

      </div>
    )
  }
}

export default UserProfile;