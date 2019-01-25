import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as firebase from 'firebase';

class SignUp extends Component {

  handleSignup = (values, {resetForm}) => {
    const {email, password} = values;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) =>   {
      const errorMessage = error.message;
      alert(errorMessage);
    })
  }

  render() {
    return (
      <div className="Auth">
      <h2>Sign Up</h2>
        <Formik 
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          onSubmit={this.handleSignup}
          validationSchema={Yup.object().shape({
            email: Yup.string().required('Email address is required'),
            password: Yup.string().required('Password needs to be provided'),
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
    );
  }
}

export default SignUp;
