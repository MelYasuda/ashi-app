import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';

function SignedIn(props){
  return(
  <ul className="navbar-nav ml-auto">
    <li className="nav-item active">
      <a className="nav-link" href="#/create">
        <FontAwesomeIcon icon="plus" />
      </a>
    </li>
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
      <a className="nav-link" onClick={props.handleSignOut}>
        Sign Out
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

function CondNavDisplay(props){
  const isSignedIn = props.isSignedIn;
  if (isSignedIn) {
    return <SignedIn handleSignOut={props.handleSignOut} />;
  }
  return <SignedOut handleSignIn={props.handleSignIn} />;
}

CondNavDisplay.prototTypes ={
  handleSignOut: PropTypes.func,
  handleSignIn: PropTypes.func,
  isSignedIn: PropTypes.bool
}

export default CondNavDisplay;