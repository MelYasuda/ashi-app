import React, { Component } from 'react';
import * as firebase from 'firebase';

class UserProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      user: null
    }

    const selectedUid = this.props.location.search.split('=')[1]

    const getUser = () => {
      return new Promise((resolve, reject) => {
        const uid = selectedUid;
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
          <li>{Bio}</li>
          <img src={profileImageUrl} alt='profile'  />
        </ul>
      </div>
    )
  }
}

export default UserProfile;