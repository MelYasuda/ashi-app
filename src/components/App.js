import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar/NavBar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faHome, faHeart} from '@fortawesome/free-solid-svg-icons'
import Home from './Home/Home';
import { Switch, Route } from "react-router-dom";
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import FirebaseConfig from '../constants/FirebaseConfig.js';
import * as firebase from 'firebase';

firebase.initializeApp(FirebaseConfig);

library.add(faUser, faHome, faHeart);

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
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
                <SignUp/>
              )}
            />
            <Route 
            path="/signin"
            render={props => (
                <SignIn />
              )}
            />
          </Switch>
      </div>
    );
  }
}

export default App;
