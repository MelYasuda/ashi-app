import React, { Component } from 'react';
import './Home.css';
import background from '../../assets/img/home-background.jpg';

class Home extends Component {
  render() {
    return (
      <img src={background} />
    );
  }
}

export default Home;
