import React, { Component } from 'react';
import * as firebase from 'firebase';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';

class EditProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      user: null
    }

    const selectedUid = this.props.location.search.split('=')[1];

    const getUser = () => {
      return new Promise((resolve, reject) => {
        const uid = selectedUid;
        firebase.database().ref('users/' + uid).on('value', (snapshot) => {
          var value = snapshot.val();
          value['uid']=uid;
          const objectContainer = {};
          objectContainer['userDetails'] = value;
          console.log(objectContainer)
          resolve(objectContainer)
        })
      })
    }

    const setUser = (objectContainer) => {
      const userDetails = objectContainer.userDetails;
      this.setState({
        user: userDetails,
      });
      this.setState({isLoading: false})
    }

    getUser().then(setUser)
  }

  render(){
    if(this.state.isLoading) return null;
    console.log(this.state.user)
    return(
      <div className="EditProfile">
        <div className='form-border'>
          <p>Edit profile</p>
          <Formik 
            initialValues={{ userName:`${this.state.user.username}`, bio:`${this.state.user.Bio}`, status: '', website: '' }}
            onSubmit={this.handleSignup}
            render={({
              values,
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              touched
              }) => (
                <form onSubmit={handleSubmit}>
                <div className="image-upload">
                  <label for="file-input">
                      <img src={this.state.user.profileImageUrl} alt="file upload icon"/>
                  </label>
                  <input type='file' id="file-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                </div>
                <TextForm
                  title='Username'
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name='userName'
                  error={touched.userName && errors.userName}
                  />
                <TextForm
                  title='Bio'
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name='bio'
                  error={touched.bio && errors.bio}
                  />

                  <button
                  type="submit"
                  className="btn btn-primary"
                  >Submit</button>
                </form>
              )}
            />
          </div>
        </div>
    )
  }
}

export default EditProfile;