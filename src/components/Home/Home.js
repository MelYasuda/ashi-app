import React, { Component } from 'react';
import './Home.css';
import background from '../../assets/img/home-background.jpg';

class Home extends Component {
  render() {
    return (
      <div style={divStyle}></div>
    );
  }
}

const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + background + ')',
  height: 92 +'vh',
  width: 100 + '%'
};

export default Home;
