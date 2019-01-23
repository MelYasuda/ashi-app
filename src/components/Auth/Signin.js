import React, { Component } from 'react';
import './Auth.css';
import TextForm from '../TextForm/TextForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

class SignIn extends Component {
  render() {
    return (
      <div className="Auth">
        <h2>Sign In</h2>
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
            setFieldValue,
            setFieldTouched,
            errors,
            touched,
            }) => (
              <form>
                <TextForm
                  label='Email'
                  value={values.email}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  autoCapitalize="none"
                  name='email'
                  error={touched.email && errors.email}
                  />
                <TextForm
                  label='Password'
                  value={values.password}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  autoCapitalize="none"
                  name='password'
                  error={touched.password && errors.password}
                  />
                <button
                title="Submit"
                className="btn btn-primary"
                onPress={handleSubmit}
                >Submit</button>
              </form>
            )}
          />
      </div>
    );
  }
}

export default SignIn;