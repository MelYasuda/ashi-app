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
import CurrentLocation from './Map/LoadMapApp';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();

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
        console.log(this.state.isAuthenticating)
      });
  }


  render() {
    console.log("page rendered")
    if(this.state.isAuthenticating) return null;
    return (
      <Provider store={store}>
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
            path="/listings"
            render={props => (
                <Listings />
              )}
            />
            <Route 
            path="/maps"
            render={props => (
              this.state.isAuthenticated===true ? <CurrentLocation/> : <Redirect to={{ pathname: '/signin'}}
              />
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
      </Provider>

    );
  }
}

export default withRouter(App);
