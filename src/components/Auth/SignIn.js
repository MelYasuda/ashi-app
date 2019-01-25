import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as firebase from 'firebase';

class SignIn extends Component {

  handleSignin = (values, {resetForm}) => {
    const {email, password} = values;
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) =>   {
      const errorMessage = error.message;
      alert(errorMessage);
    })
  }

  render() {
    return (
      <div className="Auth">
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
                <button
                type="submit"
                className="btn btn-primary"
                >Submit</button>
              </form>
            )}
          />
      </div>
    );
  }
}

export default SignIn;
