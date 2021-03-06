import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as firebase from 'firebase';
import facebook from '../../assets/img/facebook.png'

var provider = new firebase.auth.FacebookAuthProvider();

class SignIn extends Component {

  handleFacebookSignIn = () => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      const uid = user.uid;
      const photoURL = `${user.photoURL}?width=300`;
      firebase.database().ref('users/' + uid).set({
        username: user.displayName,
        email: user.email,
        Bio: null,
        profileImageUrl: photoURL
      })

    }).then(
      this.props.history.push('/')
    ).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  handleSignin = (values, {resetForm}) => {
    const {email, password} = values;
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) =>   {
      const errorMessage = error.message;
      alert(errorMessage);
    }).then( () => {
      this.props.history.push("/");
    })
  }

  render() {
    return (
      <div className="Auth">
        <div className='form-border'>
          <h2>Sign In</h2>
          <Formik 
            initialValues={{ email: '', password: '' }}
            onSubmit={this.handleSignin}
            validationSchema={Yup.object().shape({
              email: Yup.string().required('Email address is required'),
              password: Yup.string().required('Password needs to be provided')
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
                  <div id='signin-btn-group'>
                  Do you have an account?
                  <button
                  type="submit"
                  className="btn btn-primary"
                  >Sing In</button>
                  </div>
                </form>
              )}
            />
            <div id='fb-btn-group'>
              Or sign in with
              <img className='facebook-login' src={facebook} onClick={()=>this.handleFacebookSignIn()} />
            </div>
          </div>
      </div>
    );
  }
}

export default SignIn;
