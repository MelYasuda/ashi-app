import React, { Component } from 'react';
import './NavBar.css';

class NavBar extends Component {
  render() {
    return (
      <div className="NavBar">
      <nav
      id="top-navbar"
      className="navbar navbar-expand-lg"
    >
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a id="brand1" className="nav-link" href="">
              <i className="fa fa-instagram" aria-hidden="true" />
            </a>
          </li>
          <li className="nav-item active">
            <a id="brand2" className="nav-link" href="#">
              <img style={{ width: 70 }} alt="" />
            </a>
          </li>
        </ul>
      </div>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              <i className="fa fa-compass" aria-hidden="true" />
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="#">
              <i className="fa fa-heart-o" aria-hidden="true" />
            </a>
          </li>
          <li className="nav-item active">
            <a id="cart" className="nav-link">
              <i className="fa fa-user-o" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
      </div>
    );
  }
}

export default NavBar;