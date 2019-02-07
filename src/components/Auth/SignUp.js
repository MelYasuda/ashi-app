import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as firebase from 'firebase';
import fileUpload from '../../assets/img/profile.png'

class SignUp extends Component {

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
    
    const userData = (user) => {
      console.log(user)
      return new Promise((resolve, reject) => {
      const uid = user.uid
        console.log(uid)
        firebase.database().ref('users/' + uid).set({
          username: userName,
          email: email,
          Bio: bio
        })
        resolve()
      })
    }
    
    auth().then(userId).then(userData).then( () => {
      this.props.history.push("/");
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
                  <label for="file-input">
                      <img id='clickable-img' src={fileUpload} alt="file upload icon"/>
                  </label>
                  <input type='file' id="file-input" name='pic' className='' />
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
