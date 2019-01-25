import React, { Component } from "react";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as firebase from 'firebase';

function SignedIn(props){
  return(
      <ul className="navbar-nav ml-auto">
    <li className="nav-item active">
      <a className="nav-link" href="#">
        <FontAwesomeIcon icon="heart" />
      </a>
    </li>
    <li className="nav-item active">
      <a className="nav-link" href="#">
        <FontAwesomeIcon icon="user" />
      </a>
    </li>
    <li className="nav-item active">
      <a className="nav-link" onClick={props.handleSignout}>
        Logout
      </a>
    </li>
  </ul>
  );
}

function SignedOut(props){
  return(
      <ul className="navbar-nav ml-auto">
    <li className="nav-item active">
      <a className="nav-link" href="/#/signin">
        Sign In
      </a>
    </li>
    <li className="nav-item active">
      <a className="nav-link" href="/#/signup">
        Sign Up
      </a>
    </li>
  </ul>
  );
}

function NavDisplay(props){
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <SignedIn handleSignout={props.handleSignout} />;
  }
  return <SignedOut handleSignout={props.handleSignout} />;
}

class NavBar extends Component {

  handleSignout = () => {
    firebase.auth().signOut().then(()=> {
    alert("logout")
    }).catch(function(error) {
      alert(error)
    });
  }

  render() {
    console.log(this.props.isSignedIn);
    return (
      <div className="NavBar">
        <nav id="top-navbar" className="navbar navbar-expand-sm">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a id="brand" className="nav-link" href="">
                  <FontAwesomeIcon icon="home" />
                </a>
              </li>
            </ul>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavDisplay isLoggedIn={this.props.isSignedIn} handleSignout={this.handleSignout}/>
          </div>

        </nav>
      </div>
    );
  }
}

export default NavBar;
