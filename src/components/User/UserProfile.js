import React, { Component } from 'react';
import * as firebase from 'firebase';
import Listing from '../Listings/Listing';

const EditButton = (props) => {
  const currentUid = firebase.auth().currentUser.uid

  console.log()

  if(props.uid === currentUid){
    return <button className='btn btn-success'>Edit</button>
  } else {
    return null
  }
}

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
            Object.keys(listings).map(categoryKey=> {
              const listing = listings[categoryKey];
             Object.keys(listing).map(key => {
                const details = listing[key];
                if(categoryKey==="Roommate"){
                  details["category"] = 0
                  } else if (categoryKey==="Solo Apartments"){
                  details["category"] = 1
                  } else {
                  details["category"] = 2
                  }
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

  componentDidUpdate = () => {

    console.log("update")
  }

  render(){

    if(this.state.isLoading) return null;
    const {Bio, profileImageUrl, username, uid} = this.state.user;
    const userListings=this.state.userListings;
    console.log(userListings)
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

        <EditButton uid={uid}  />

      </div>
    )
  }
}

export default UserProfile;