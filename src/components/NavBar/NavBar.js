import React, { Component } from "react";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as firebase from 'firebase';
import CondNavDisplay from './CondNavDisplay';

class NavBar extends Component {

  handleSignOut = () => {
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
            <CondNavDisplay isSignedIn={this.props.isSignedIn} handleSignOut={this.handleSignOut}/>
          </div>

        </nav>
      </div>
    );
  }
}

export default NavBar;
