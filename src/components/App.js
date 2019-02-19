import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar/NavBar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faHome, faHeart, faPlus} from '@fortawesome/free-solid-svg-icons'
import Home from './Home/Home';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import FirebaseConfig from '../constants/FirebaseConfig.js';
import * as firebase from 'firebase';
import CreateListing from './CreateListing/CreateListing';
import Listings from './Listings/Listings';
import UserProfile from './User/UserProfile';
import CurrentLocation from './Map/LoadMapApp';
import { Provider } from 'react-redux';
import {persistor, store} from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react'
import EditProfile from './User/EditProfile';
import EditListing from './EditListing/EditListing';
import SavedListings from './SavedListings/SavedListings';

// const store = store;
// const persistor = persistor;

firebase.initializeApp(FirebaseConfig);

library.add(faUser, faHome, faHeart, faPlus);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    }
    var p = new Promise((resolve, reject)=>{
      firebase.auth().onAuthStateChanged( user => {
        if(user){
          this.setState({ isAuthenticated: true });
        }
        resolve()
      })
     });
     
     p.then(()=>{
       this.setState({ isAuthenticating: false })
      });
  }


  render() {
    if(this.state.isAuthenticating) return null;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <div className="App">
        <NavBar 
          isSignedIn={this.state.isAuthenticated}
          history={this.props.history}
           />
          <Switch>
            <Route 
            exact path="/"
            render={props => (
                <Home history={this.props.history}/>
              )}
            />
            <Route 
            exact path="/listings"
            render={props => (
                <Listings history={this.props.history}/>
              )}
            />
            <Route 
            path="/listings/create"
            render={props => (
              this.state.isAuthenticated===true ? <CreateListing history={this.props.history}/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />
            <Route 
            path="/listings/edit"
            render={props => (
              this.state.isAuthenticated===true ? <EditListing history={this.props.history} {...props}/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />
            <Route 
            path="/saved"
            render={props => (
              this.state.isAuthenticated===true ? <SavedListings history={this.props.history} {...props}/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />
            <Route 
            path="/signup"
            render={props => (
                <SignUp history={this.props.history} />
              )}
            />
            <Route 
            path="/signin"
            render={props => (
                <SignIn history={this.props.history} />
              )}
            />
            <Route 
            exact path="/user"
            render={props => (
              this.state.isAuthenticated===true ? <UserProfile {...props}/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />
            <Route 
            path="/user/edit"
            render={props => (
              this.state.isAuthenticated===true ? <EditProfile {...props} history={this.props.history}/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />

            <Route 
            path="/maps"
            render={props => (
              this.state.isAuthenticated===true ? <CurrentLocation/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />
          </Switch>
         </div>
        </PersistGate>
      </Provider>

    );
  }
}

export default withRouter(App);
