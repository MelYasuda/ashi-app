import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

class SignUp extends Component {

  handleSignup = (values, {resetForm}) => {
    const {email, password} = values;
    console.log(email)
    // firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) =>   {
    //   const errorMessage = error.message;
    //   Alert.alert(errorMessage);
    // })
  }

  render() {
    return (
      <div className="Auth">
      <h2>Sign Up</h2>
        <Formik 
          initialValues={{ email: '', password: '' }}
          onSubmit={this.handleSignup}
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
                title="Submit"
                className="btn btn-primary"
                onClick={handleSubmit}
                >Submit</button>
              </form>
            )}
          />
      </div>
    );
  }
}

export default SignUp;