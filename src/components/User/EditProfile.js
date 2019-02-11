import React, { Component } from 'react';
import * as firebase from 'firebase';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

let selectedFile ='';

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
  
  handleUserEdit = (values) => {
    const {userName, bio, profileImageUrl, website, status} = values;

    let updatedProfileImageUrl = '';
    const difineProfileImageUrl = () => {
      return new Promise((resolve, reject) => {
        if(selectedFile){
          const storageService = firebase.storage();
          const storageRef = storageService.ref();
          const uploadTask = storageRef.child(`profile_images/${selectedFile.name}`).put(selectedFile); 
          uploadTask.then(snapshot => {
            return snapshot.ref.getDownloadURL(); 
        }).then(downloadURL => { 
          updatedProfileImageUrl = downloadURL;
          resolve()
         })
        } else {
          updatedProfileImageUrl = profileImageUrl;
          resolve()
        }
      })
    }

    const writeNewUserDetails = () => {
      return new Promise((resolve, reject)=>{
        console.log(selectedFile);
        const uid = this.state.user.uid;
        firebase.database().ref('users/' + uid).set({
          username: userName,
          Bio: bio,
          profileImageUrl: updatedProfileImageUrl,
          Website: website,
          Status: status
        })
        resolve()
      })
    }


    const redirectToUserPage = () => {
      const selectedUid = this.props.location.search.split('=')[1];      this.props.history.push({
        pathname: '/user',
        search: '?id=' + selectedUid 
      });
    }

    difineProfileImageUrl().then(writeNewUserDetails).then(redirectToUserPage)

  }

  handleFileUploadChange = (e) => {
    selectedFile = e.target.files[0];
    console.log(selectedFile)
  }

  render(){
    console.log(this.state.user)
    if(this.state.isLoading) return null;
    const user = this.state.user;
    const websiteValue = user.Website ? user.Website: ''
    return(
      <div className="EditProfile">
        <div className='form-border'>
          <p>Edit profile</p>
          <Formik 
            initialValues={{ 
              userName:`${user.username}`, 
              bio:`${user.Bio}`, 
              status: `${user.Status}`, 
              website: websiteValue, 
              profileImageUrl: `${user.profileImageUrl}` }}
            onSubmit={this.handleUserEdit}
            validationSchema={Yup.object().shape({
              userName: Yup.string().required('Username needs to be provided'),
              bio: Yup.string().required('Your bio needs to be provided'),
            })}
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
                  <label htmlFor="file-input">
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
                  <TextForm
                  title='Website'
                  value={values.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name='website'
                  />
                  <label>You are</label>
                  <select
                      className="form-control" 
                      id="status"
                      value={values.status}
                      onChange={handleChange}
                      name='status'
                      >
                      <option value=''>--</option>
                      <option value='individual'>Individual</option>
                      <option value='company'>Company</option>
                    </select>
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