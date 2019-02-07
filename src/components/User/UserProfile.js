import React, { Component } from 'react';
import * as firebase from 'firebase';

class UserProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      user: null
    }

    const getUser = () => {
      return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        const uid = user.uid
        firebase.database().ref('users/' + uid).on('value', (snapshot) => {
          var value = snapshot.val();
          console.log(value)
        resolve(value)
        })
      })
    }

    const setUser = (value) => {
      this.setState({user: value});
      this.setState({isLoading: false})
    }

    getUser().then(setUser);


  }

  render(){
    if(this.state.isLoading) return null;
    const {Bio, email, profileImageUrl, username} = this.state.user;
    return(
      <div>
        <h1>user profile</h1>
        <ul>
          <li>{username}</li>
          <li>{email}</li>
          <li>{Bio}</li>
          <img src={profileImageUrl} alt='profile'  />
        </ul>
      </div>
    )
  }
}

export default UserProfile;