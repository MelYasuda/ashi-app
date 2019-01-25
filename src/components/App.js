import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar/NavBar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faHome, faHeart} from '@fortawesome/free-solid-svg-icons'
import Home from './Home/Home';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import FirebaseConfig from '../constants/FirebaseConfig.js';
import * as firebase from 'firebase';
import CreateListing from './CreateListing/CreateListing';

firebase.initializeApp(FirebaseConfig);

library.add(faUser, faHome, faHeart);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    }
    firebase.auth().onAuthStateChanged( user => {
      console.log(user)
      if(user){
        this.setState({ isAuthenticated: true })
      } else {
        this.setState({ isAuthenticated: false })
      }
    });
  }


  render() {
    return (
      <div className="App">
        <NavBar isSignedIn={this.state.isAuthenticated} />
          <Switch>
            <Route 
            exact path="/"
            render={props => (
                <Home />
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
            path="/create"
            render={props => (
              this.state.isAuthenticated===true ? <CreateListing/> : <Redirect to={{ pathname: '/signin'}}
              />
              )}
            />
          </Switch>
      </div>
    );
  }
}

export default withRouter(App);
