import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as firebase from 'firebase';
import fileUpload from '../../assets/img/profile.png'

const uuidv4 = require('uuid/v4');
let selectedFile = '';

class SignUp extends Component {

  constructor(props){
    super(props);
    this.state = {
      file: fileUpload
    }
  }

  handleSignup = (values, {resetForm}) => {
    const {email, password, userName, bio} = values;
    const auth = () => {
      return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) =>   {
          const errorMessage = error.message;
          alert(errorMessage);
        }
        )
        resolve()
      })
    }

    const userId = () => {
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged( user => {
          if(user){
            resolve(user)
          }
        })
      })
    }
    
    const storageService = firebase.storage();
    const storageRef = storageService.ref();

    const handleProfilePhotoSubmit = (user) => {
      return new Promise((resolve, reject) => {
        const uid = user.uid;
        const uploadTask = storageRef.child(`profile_images/${uuidv4()}`).put(selectedFile); 
        uploadTask.then(snapshot => {
          return snapshot.ref.getDownloadURL();
      }).then(downloadURL => {
        const filePath = downloadURL;
        const containerObject = {};
        containerObject['uid'] = uid;
        containerObject['downloadURL'] = filePath
        console.log(containerObject);
        resolve(containerObject)
     })
      })
    }

    const addImgUrlToUserData = (containerObject) => {
      return new Promise((resolve, reject) => {
        const uid = containerObject.uid;
        const downloadURL = containerObject.downloadURL;
        firebase.database().ref('users/' + uid).set({
          username: userName,
          email: email,
          Bio: bio,
          profileImageUrl: downloadURL
        })
        resolve()
      })
    }
    
    if(selectedFile){
      auth().then(userId).then(handleProfilePhotoSubmit).then(addImgUrlToUserData).then( () => {
        this.props.history.push("/");
      })} else {
        alert("Please select your profile photo.")
      }

  }


  handleFileUploadChange = (e) => {
    selectedFile = e.target.files[0];
    console.log(selectedFile)
    this.setState({
      file: URL.createObjectURL(selectedFile)
    })
  }

  render() {
    return (
      <div className="Auth">
        <div className='form-border'>
          <p>Sign Up</p>
          <Formik 
            initialValues={{ email: '', password: '', confirmPassword: '', userName:'', bio:'' }}
            onSubmit={this.handleSignup}
            validationSchema={Yup.object().shape({
              email: Yup.string().required('Email address is required'),
              password: Yup.string().required('Password needs to be provided'),
              userName: Yup.string().required('Username needs to be provided'),
              bio: Yup.string().required('Your bio needs to be provided'),
              confirmPassword: Yup.string()
                .oneOf(
                  [Yup.ref('password', null)],
                  'Confirm Password must matched Password',
                )
                .required('Confirm Password is required'),
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
                      <img id='clickable-img' 
                      src={this.state.file} 
                      alt="file upload icon"/>
                  </label>
                  <input type='file' id="file-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                </div>
                <TextForm
                    placeHolder='What is you name?'
                    label='UserName'
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='userName'
                    error={touched.userName && errors.userName}
                    />
                    <TextForm
                    placeHolder='Please tell us about yourself'
                    label='Bio'
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='bio'
                    error={touched.bio && errors.bio}
                    />
                  <TextForm
                    label='Email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    name='email'
                    error={touched.email && errors.email}
                    />
                  <TextForm
                    label='Password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    name='password'
                    error={touched.password && errors.password}
                    />
                    <TextForm
                    label='Confirm Password'
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    name='confirmPassword'
                    error={touched.confirmPassword && errors.confirmPassword}
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
      );
    }
  }

export default SignUp;
